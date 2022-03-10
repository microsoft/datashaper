/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterStep } from '@data-wrangling-components/core'
import {
	DataType,
	types,
	FilterCompareType,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@data-wrangling-components/core'
import set from 'lodash-es/set.js'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useLoadTable, useHandleDropdownChange } from '../../../common/index.js'
import { InputExplainer } from '../../../common/styles.js'
import { EnumDropdown } from '../../../controls/EnumDropdown.js'
import { ColumnOrValueComboBox } from '../../../controls/index.js'
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

		const tps = useMemo(() => {
			return tbl ? types(tbl) : {}
		}, [tbl])

		const operatorDropdown = useMemo(() => {
			const column = internal.args.column
			if (column) {
				const type = tps[column]
				if (type === DataType.String) {
					return (
						<DropdownContainer>
							<EnumDropdown
								required
								label={'Function'}
								enumeration={StringComparisonOperator}
								selectedKey={internal.args.operator}
								onChange={handleOpChange}
							/>
							<InputExplainer>
								String comparisons are not case-sensitive
							</InputExplainer>
						</DropdownContainer>
					)
				}
			}
			return (
				<EnumDropdown
					required
					enumeration={NumericComparisonOperator}
					label={'Function'}
					selectedKey={internal.args.operator}
					onChange={handleOpChange}
				/>
			)
		}, [tps, internal, handleOpChange])

		const isEmptyCheck = useMemo(() => {
			const { operator } = internal.args
			return (
				operator === NumericComparisonOperator.IsEmpty ||
				operator === NumericComparisonOperator.IsNotEmpty ||
				operator === StringComparisonOperator.IsEmpty ||
				operator === StringComparisonOperator.IsNotEmpty
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

const DropdownContainer = styled.div`
	display: flex;
	flex-direction: column;
`
