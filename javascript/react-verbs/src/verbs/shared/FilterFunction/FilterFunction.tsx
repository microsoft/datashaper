/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Criterion } from '@data-wrangling-components/core'
import {
	BooleanComparisonOperator,
	FilterCompareType,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@data-wrangling-components/core'
import {
	ColumnOrValueComboBox,
	EnumDropdown,
	narrowDropdownStyles,
} from '@data-wrangling-components/react-controls'
import { DataType } from '@essex/arquero'
import type { IComboBoxOption, IDropdownOption } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useTableColumnOptions } from '@data-wrangling-components/react-hooks'

import { InputExplainer } from '../../../common/styles.js'
import {
	useColumnTyping,
	useIsEmpty,
	usePlaceholderText,
} from './FilterFunction.hooks.js'

export interface FilterFunctionProps {
	table: ColumnTable
	column: string
	criterion: Criterion
	onChange?: (filter?: Criterion) => void
	suppressLabels?: boolean
}
/**
 * Just the comparison logic/ops for a filter.
 * Input table and source column is expected to be edited elsewhere and configured as the step input.
 * This is split out from FilterInputs to allow just the comparison logic to be reused elsewhere.
 */
export const FilterFunction: React.FC<FilterFunctionProps> = memo(
	function FilterFunction({
		table,
		column,
		criterion,
		onChange,
		suppressLabels = false,
	}) {
		const handleOpChange = useCallback(
			(_e: React.FormEvent<HTMLDivElement>, opt?: IDropdownOption) => {
				onChange?.({
					...criterion,
					operator: opt?.key as
						| StringComparisonOperator
						| NumericComparisonOperator
						| BooleanComparisonOperator,
				})
			},
			[criterion, onChange],
		)

		const handleComboBoxChange = useCallback(
			(
				_e: any,
				option: IComboBoxOption | undefined,
				_index: number | undefined,
				value: string | undefined,
			) => {
				const update = {
					...criterion,
					type: option ? FilterCompareType.Column : FilterCompareType.Value,
					value: option ? option.key : value,
				}
				onChange?.(update)
			},
			[criterion, onChange],
		)

		const { type, columnFilter } = useColumnTyping(table, column)

		const operatorDropdown = useMemo(() => {
			const shared = {
				required: !suppressLabels,
				label: suppressLabels ? undefined : 'Function',
				selectedKey: criterion.operator,
				onChange: handleOpChange,
				styles: leftStyles,
			}
			if (column) {
				if (type === DataType.String) {
					return (
						<EnumDropdown enumeration={StringComparisonOperator} {...shared} />
					)
				} else if (type === DataType.Boolean) {
					return (
						<EnumDropdown enumeration={BooleanComparisonOperator} {...shared} />
					)
				}
			}
			// map to nicer "math like" terse labels for numeric operations
			// (the default will use the friendly enum keys)
			const labels = {
				'=': '=',
				'!=': '!=',
				'<': '<',
				'<=': '<=',
				'>': '>',
				'>=': '>=',
			}
			return (
				<EnumDropdown
					enumeration={NumericComparisonOperator}
					{...shared}
					labels={labels}
				/>
			)
		}, [type, column, criterion, handleOpChange, suppressLabels])

		const isEmpty = useIsEmpty(criterion)
		const handleDeleteClick = useCallback(() => onChange?.(), [onChange])
		const placeholder = usePlaceholderText(type)
		const columnOptions = useTableColumnOptions(table, columnFilter)

		return (
			<Container>
				<SideBySide>
					{operatorDropdown}
					<ColumnOrValueComboBox
						required={!suppressLabels}
						options={columnOptions}
						disabled={isEmpty}
						label={suppressLabels ? undefined : 'Comparison value'}
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
