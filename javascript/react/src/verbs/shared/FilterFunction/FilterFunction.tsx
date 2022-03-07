/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterStep } from '@data-wrangling-components/core'
import {
	FilterCompareType,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@data-wrangling-components/core'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useLoadTable, useHandleDropdownChange } from '../../../common/index.js'
import {
	ColumnOrValueComboBox,
	NumericComparisonOperatorDropdown,
	StringComparisonOperatorDropdown,
} from '../../../controls/index.js'
import { LeftAlignedRow } from '../../../index.js'
import type { StepComponentProps } from '../../../types.js'

/**
 * Just the comparison logic/ops for a filter.
 * Input table and source column is expected to be edited elsewhere and configured as the step input.
 * This is split out from FilterInputs to allow just the comparison logic to be reused elsewhere.
 */
export const FilterFunction: React.FC<StepComponentProps> = memo(
	function FilterFunction({ step, store, table, onChange, input }) {
		const internal = useMemo(() => step as FilterStep, [step])

		const tbl = useLoadTable(input || internal.input, table, store)

		const handleOpChange = useHandleDropdownChange(
			internal,
			'args.operator',
			onChange,
		)

		const handleComboBoxChange = useCallback(
			(_e, option, _index, value) => {
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
				const first = tbl?.get(column, 0)
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
		}, [tbl, internal, handleOpChange])

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
			<Container>
				<LeftAlignedRow>{operatorDropdown}</LeftAlignedRow>
				<LeftAlignedRow>
					<ColumnOrValueComboBox
						required
						table={tbl}
						disabled={isEmptyCheck}
						label={'Comparison value'}
						placeholder={'text, number, or column'}
						text={internal.args.value ? `${internal.args.value}` : undefined}
						onChange={handleComboBoxChange}
					/>
				</LeftAlignedRow>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
`
