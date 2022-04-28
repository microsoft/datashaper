/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@data-wrangling-components/core'
import { ParseType } from '@data-wrangling-components/core'
import { num } from '@data-wrangling-components/primitives'
import {
	DateFormatPatternCombobox,
	dropdownStyles,
	EnumDropdown,
} from '@data-wrangling-components/react-controls'
import { DataType } from '@essex/arquero'
import type { IComboBoxOption } from '@fluentui/react'
import { TextField } from '@fluentui/react'
import { produce } from 'immer'
import cloneDeep from 'lodash-es/cloneDeep.js'
import set from 'lodash-es/set.js'
import { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
	useDropdownChangeHandler,
	useTextFieldChangeHandler,
} from '../../common/hooks.js'
import { LeftAlignedColumn } from '../../common/index.js'
import { withLoadedTable } from '../../common/withLoadedTable.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'
import { getColumnType } from '../shared/TypingFunction/TypingFunction.js'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps<ConvertArgs>> = memo(
	withLoadedTable(function Convert({ step, store, onChange, dataTable }) {
		const [inputColumnDate, setInputColumnDate] = useState<boolean>()

		const handleTypeChange = useDropdownChangeHandler(
			step,
			(s, opt) => (s.args.type = opt as ParseType),
			onChange,
		)

		const handleRadixChange = useTextFieldChangeHandler(
			step,
			(s, opt) => (s.args.radix = num(opt)),
			onChange,
		)

		const handleComboBoxChange = useCallback(
			(
				_e: any,
				option: IComboBoxOption | undefined,
				_index: number | undefined,
				value: string | undefined,
			) => {
				const update = cloneDeep(step)
				set(update, 'args.formatPattern', option ? option.key : value)
				onChange?.(
					produce(step, draft => {
						draft.args.formatPattern = option ? (option.key as string) : value
					}),
				)
			},
			[step, onChange],
		)

		const handleComboBoxInputChange = (text: string) => {
			const update = cloneDeep(step)
			set(update, 'args.formatPattern', text ? text : '%Y-%m-%d')
			onChange && onChange(update)
		}

		useEffect(() => {
			setInputColumnDate(false)
			step.args.columns.forEach((column: string | undefined) => {
				const type = getColumnType(dataTable, column)
				if (type === DataType.Date) setInputColumnDate(true)
			})
		}, [step.args.columns, dataTable])

		return (
			<Container>
				<LeftAlignedColumn>
					<ColumnListInputs
						label={'Columns to convert'}
						step={step}
						store={store}
						onChange={onChange as any}
					/>
				</LeftAlignedColumn>
				<LeftAlignedColumn>
					<EnumDropdown
						required
						label={'Data type'}
						enumeration={ParseType}
						selectedKey={step.args.type}
						onChange={handleTypeChange}
					/>
				</LeftAlignedColumn>
				{step.args.type === ParseType.Integer ? (
					<LeftAlignedColumn>
						<TextField
							label={'Base (radix)'}
							value={step.args.radix ? `${step.args.radix}` : ''}
							styles={dropdownStyles}
							onChange={handleRadixChange}
						/>
					</LeftAlignedColumn>
				) : null}

				{inputColumnDate || step.args.type === ParseType.Date ? (
					<LeftAlignedColumn>
						<DateFormatPatternCombobox
							required={step.args.type === ParseType.Date}
							label={'Date format pattern'}
							placeholder={'pattern'}
							text={
								step.args.formatPattern
									? `${step.args.formatPattern}`
									: undefined
							}
							onChange={handleComboBoxChange}
							styles={dropdownStyles}
							onInputValueChange={handleComboBoxInputChange}
						/>
					</LeftAlignedColumn>
				) : null}
			</Container>
		)
	}),
)

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-direction: column;
`
