/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertStep } from '@data-wrangling-components/core'
import { DataType, ParseType } from '@data-wrangling-components/core'
import { TextField } from '@fluentui/react'
import cloneDeep from 'lodash-es/cloneDeep.js'
import set from 'lodash-es/set.js'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
	useHandleDropdownChange,
	useHandleTextfieldChange,
	useLoadTable,
} from '../../common/hooks.js'
import { LeftAlignedColumn } from '../../common/index.js'
import { DateFormatPatternCombobox } from '../../controls/DateFormatPatternCombobox.js'
import { EnumDropdown } from '../../controls/EnumDropdown.js'
import { dropdownStyles } from '../../controls/styles.js'
import type { StepComponentProps } from '../../types.js'
import { ColumnListInputs } from '../shared/index.js'
import { getColumnType } from '../shared/TypingFunction/TypingFunction.js'

/**
 * Provides inputs for a Convert step.
 */
export const Convert: React.FC<StepComponentProps> = memo(function Convert({
	step,
	store,
	table,
	onChange,
	input,
}) {
	const internal = useMemo(() => step as ConvertStep, [step])
	const tbl = useLoadTable(input || internal.input, table, store)
	const [inputColumnDate, setInputColumnDate] = useState<boolean>()

	const handleTypeChange = useHandleDropdownChange(
		internal,
		'args.type',
		onChange,
	)

	const handleRadixChange = useHandleTextfieldChange(
		internal,
		'args.radix',
		onChange,
	)

	const handleComboBoxChange = useCallback(
		(_e, option, _index, value) => {
			const update = cloneDeep(step)
			set(update, 'args.formatPattern', option ? option.key : value)
			onChange && onChange(update)
		},
		[step, onChange],
	)

	useEffect(() => {
		setInputColumnDate(false)
		internal.args.columns.forEach(column => {
			const type = getColumnType(tbl, column)

			if (type === DataType.Date) setInputColumnDate(true)
		})
	}, [internal.args.columns, tbl])

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
					selectedKey={internal.args.type}
					onChange={handleTypeChange}
				/>
			</LeftAlignedColumn>
			{internal.args.type === ParseType.Integer ? (
				<LeftAlignedColumn>
					<TextField
						label={'Base (radix)'}
						value={internal.args.radix ? `${internal.args.radix}` : ''}
						styles={dropdownStyles}
						onChange={handleRadixChange}
					/>
				</LeftAlignedColumn>
			) : null}

			{inputColumnDate || internal.args.type === ParseType.Date ? (
				<LeftAlignedColumn>
					<DateFormatPatternCombobox
						required={internal.args.type === ParseType.Date}
						label={'Date format pattern'}
						placeholder={'pattern'}
						text={
							internal.args.formatPattern
								? `${internal.args.formatPattern}`
								: undefined
						}
						onChange={handleComboBoxChange}
						styles={dropdownStyles}
					/>
				</LeftAlignedColumn>
			) : null}
		</Container>
	)
})

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	align-content: flex-start;
	flex-direction: column;
`
