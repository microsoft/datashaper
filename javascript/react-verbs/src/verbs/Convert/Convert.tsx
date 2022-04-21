/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@data-wrangling-components/core'
import { ParseType } from '@data-wrangling-components/core'
import {
	DateFormatPatternCombobox,
	dropdownStyles,
	EnumDropdown,
} from '@data-wrangling-components/react-controls'
import { DataType } from '@essex/arquero'
import { NodeInput } from '@essex/dataflow'
import type { IComboBoxOption } from '@fluentui/react'
import { TextField } from '@fluentui/react'
import cloneDeep from 'lodash-es/cloneDeep.js'
import set from 'lodash-es/set.js'
import { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
	useHandleDropdownChange,
	useHandleTextfieldChange,
	useLoadTable,
} from '../../common/hooks.js'
import { LeftAlignedColumn } from '../../common/index.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'
import { getColumnType } from '../shared/TypingFunction/TypingFunction.js'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps<ConvertArgs>> = memo(
	function Convert({ step, store, table, onChange, input }) {
		const tbl = useLoadTable(
			input || step.input[NodeInput.Source]?.node,
			table,
			store,
		)
		const [inputColumnDate, setInputColumnDate] = useState<boolean>()

		const handleTypeChange = useHandleDropdownChange(
			step,
			'args.type',
			onChange,
		)

		const handleRadixChange = useHandleTextfieldChange(
			step,
			'args.radix',
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
				onChange?.(update)
			},
			[step, onChange],
		)

		useEffect(() => {
			setInputColumnDate(false)
			step.args.columns.forEach(column => {
				const type = getColumnType(tbl, column)

				if (type === DataType.Date) setInputColumnDate(true)
			})
		}, [step.args.columns, tbl])

		return (
			<Container>
				<LeftAlignedColumn>
					<ColumnListInputs
						label={'Columns to convert'}
						step={step}
						store={store}
						onChange={onChange}
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
						/>
					</LeftAlignedColumn>
				) : null}
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-direction: column;
`
