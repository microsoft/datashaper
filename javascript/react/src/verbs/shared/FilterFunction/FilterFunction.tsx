/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criterion } from '@data-wrangling-components/core'
import {
	DataType,
	FilterCompareType,
	NumericComparisonOperator,
	StringComparisonOperator,
	types,
} from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { InputExplainer } from '../../../common/styles.js'
import { EnumDropdown } from '../../../controls/EnumDropdown.js'
import { ColumnOrValueComboBox } from '../../../controls/index.js'
import { narrowDropdownStyles } from '../../../controls/styles.js'

export interface FilterFunctionProps {
	table: ColumnTable
	column: string
	criterion: Criterion
	onChange?: (filter?: Criterion) => void
}
/**
 * Just the comparison logic/ops for a filter.
 * Input table and source column is expected to be edited elsewhere and configured as the step input.
 * This is split out from FilterInputs to allow just the comparison logic to be reused elsewhere.
 */
export const FilterFunction: React.FC<FilterFunctionProps> = memo(
	function FilterFunction({ table, column, criterion, onChange }) {
		const handleOpChange = useCallback(
			(_e: React.FormEvent<HTMLDivElement>, opt?: IDropdownOption) => {
				onChange &&
					onChange({
						...criterion,
						operator: opt?.key as
							| StringComparisonOperator
							| NumericComparisonOperator,
					})
			},
			[criterion, onChange],
		)

		const handleComboBoxChange = useCallback(
			(_e, option, _index, value) => {
				const update = {
					...criterion,
					type: option ? FilterCompareType.Column : FilterCompareType.Value,
					value: option ? option.key : value,
				}
				onChange && onChange(update)
			},
			[criterion, onChange],
		)

		const tps = useMemo(() => {
			return table ? types(table) : {}
		}, [table])

		const type = useMemo(() => tps[column], [tps, column])

		const operatorDropdown = useMemo(() => {
			if (column) {
				if (type === DataType.String) {
					return (
						<DropdownContainer>
							<EnumDropdown
								required
								label={'Function'}
								enumeration={StringComparisonOperator}
								selectedKey={criterion.operator}
								onChange={handleOpChange}
								styles={leftStyles}
							/>
						</DropdownContainer>
					)
				}
			}
			return (
				<EnumDropdown
					required
					enumeration={NumericComparisonOperator}
					label={'Function'}
					selectedKey={criterion.operator}
					onChange={handleOpChange}
					styles={leftStyles}
				/>
			)
		}, [type, column, criterion, handleOpChange])

		const isEmptyCheck = useMemo(() => {
			const { operator } = criterion
			return (
				operator === NumericComparisonOperator.IsEmpty ||
				operator === NumericComparisonOperator.IsNotEmpty ||
				operator === StringComparisonOperator.IsEmpty ||
				operator === StringComparisonOperator.IsNotEmpty
			)
		}, [criterion])

		const handleDeleteClick = useCallback(
			() => onChange && onChange(),
			[onChange],
		)

		const placeholder = useMemo(() => {
			switch (type) {
				case DataType.String:
					return 'text or column'
				case DataType.Number:
					return 'number or column'
			}
		}, [type])

		const columnFilter = useMemo(() => {
			return (name: string) => tps[name] === type
		}, [tps, type])

		return (
			<Container>
				<SideBySide>
					{operatorDropdown}
					<ColumnOrValueComboBox
						required
						table={table}
						filter={columnFilter}
						disabled={isEmptyCheck}
						label={'Comparison value'}
						placeholder={placeholder}
						text={criterion.value ? `${criterion.value}` : undefined}
						onChange={handleComboBoxChange}
						styles={narrowDropdownStyles}
					/>
					<IconButton
						title={'Remove this criterion'}
						iconProps={{ iconName: 'Delete' }}
						onClick={handleDeleteClick}
					/>
				</SideBySide>
				{type === DataType.String ? (
					<InputExplainer>
						String comparisons are not case-sensitive
					</InputExplainer>
				) : null}
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

const SideBySide = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
`

const leftStyles = {
	root: {
		...narrowDropdownStyles.root,
		marginRight: 12,
	},
}
