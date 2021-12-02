/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	FilterCompareType,
	FilterStep,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@data-wrangling-components/core'
import { internal as ArqueroTypes } from 'arquero'
import { set } from 'lodash'
import React, { memo, useCallback, useMemo, useState } from 'react'
import {
	NumericComparisonOperatorDropdown,
	StringComparisonOperatorDropdown,
} from '..'
import { useLoadTable, useHandleDropdownChange } from '../../common'
import { StepComponentProps } from '../../types'
import { ColumnOrValueComboBox } from '../ColumnOrValueComboBox'

/**
 * Just the comparison logic/ops for a filter.
 * Input table and source column is expected to be edited elsewhere and configured as the step input.
 * This is split out from FilterInputs to allow just the comparison logic to be reused elsewhere.
 */
export const FilterFunction: React.FC<StepComponentProps> = memo(
	function FilterFunction({ step, store, onChange, input }) {
		const internal = useMemo(() => step as FilterStep, [step])

		const [table, setTable] = useState<ArqueroTypes.ColumnTable | undefined>()
		useLoadTable(input || internal.input, store, setTable)

		const handleOpChange = useHandleDropdownChange(
			internal,
			'args.operator',
			onChange,
		)

		const handleComboBoxChange = useCallback(
			(e, option, index, value) => {
				const update = {
					...internal,
				}
				const type = option ? FilterCompareType.Column : FilterCompareType.Value
				const val = option ? option.key : value
				set(update, 'args.type', type)
				set(update, 'args.value', val)
				onChange && onChange(update)
			},
			[internal, onChange],
		)

		const operatorDropdown = useMemo(() => {
			const column = internal.args.column
			if (column) {
				const first = table?.get(column, 0)
				if (first) {
					if (typeof first === 'string') {
						return (
							<StringComparisonOperatorDropdown
								selectedKey={internal.args.operator}
								onChange={handleOpChange}
							/>
						)
					}
				}
			}
			return (
				<NumericComparisonOperatorDropdown
					selectedKey={internal.args.operator}
					onChange={handleOpChange}
				/>
			)
		}, [table, internal, handleOpChange])

		const isEmptyCheck = useMemo(() => {
			const { operator } = internal.args
			return (
				operator === NumericComparisonOperator.Empty ||
				operator === NumericComparisonOperator.NotEmpty ||
				operator === StringComparisonOperator.Empty ||
				operator === StringComparisonOperator.NotEmpty
			)
		}, [internal])
		return (
			<>
				{operatorDropdown}
				<ColumnOrValueComboBox
					required
					table={table}
					disabled={isEmptyCheck}
					label={'Comparison value'}
					placeholder={'text, number, or column'}
					text={internal.args.value ? `${internal.args.value}` : undefined}
					onChange={handleComboBoxChange}
				/>
			</>
		)
	},
)
