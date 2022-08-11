/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/arquero'
import {
	BooleanComparisonOperator,
	DateComparisonOperator,
	FilterCompareType,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@datashaper/core'
import type { IComboBoxOption, IDropdownOption } from '@fluentui/react'
import { IconButton, SpinButton } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'

import {
	CalendarPicker,
	ColumnCriteriaCombobox,
	EnumDropdown,
} from '../../controls/index.js'
import {
	useSimpleDropdownOptions,
	useTableColumnNames,
} from '../../hooks/index.js'
import { InputExplainer } from '../../styles.js'
import { useColumnTyping, useIsEmpty } from './FilterFunction.hooks.js'
import {
	BooleanToggle,
	Container,
	FilterContainer,
	leftStyles,
	OrLabel,
	SideBySide,
	spinStyles,
	TextValue,
} from './FilterFunction.styles.js'
import type { FilterFunctionProps } from './FilterFunction.types.js'

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
				onChange &&
					onChange({
						...criterion,
						operator: opt?.key as
							| StringComparisonOperator
							| NumericComparisonOperator
							| BooleanComparisonOperator
							| DateComparisonOperator,
					})
			},
			[criterion, onChange],
		)

		const onSelectDate = useCallback(
			(date: Date): void => {
				const update = {
					...criterion,
					type: FilterCompareType.Value,
					value: date,
				}
				onChange && onChange(update)
				setCleanLabel(false)
			},
			[criterion, onChange],
		)

		const handleDateComboBoxChange = useCallback(
			(
				_e: any,
				option: IComboBoxOption | undefined,
				_index: number | undefined,
				value: string | undefined,
			) => {
				const update = {
					...criterion,
					type: FilterCompareType.Column,
					value: option ? option.key : value,
				}
				onChange?.(update)

				setCleanLabel(true)
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
					type: FilterCompareType.Column,
					value: option ? option.key : value,
				}
				onChange?.(update)
			},
			[criterion, onChange],
		)

		const onChangeTextFieldValue = useCallback(
			(
				_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				const update = {
					...criterion,
					type: FilterCompareType.Value,
					value: newValue,
				}
				onChange?.(update)
			},
			[criterion, onChange],
		)

		const spinButtonOnChange = useCallback(
			(_event: React.SyntheticEvent<HTMLElement>, newValue?: string) => {
				if (newValue !== undefined) {
					const update = {
						...criterion,
						type: FilterCompareType.Value,
						value: newValue,
					}
					onChange?.(update)
				}
			},
			[criterion, onChange],
		)

		const onToggleChange = (
			_ev: React.MouseEvent<HTMLElement>,
			checked?: boolean,
		) => {
			const update = {
				...criterion,
				type: FilterCompareType.Value,
				value: checked,
			}
			onChange?.(update)
		}

		const { type, columnFilter } = useColumnTyping(table, column)
		const [cleanLabel, setCleanLabel] = useState<boolean>(false)

		const operatorDropdown = useMemo(() => {
			const shared = {
				required: !suppressLabels,
				label: suppressLabels ? undefined : 'Function',
				placeholder: 'Choose',
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
				} else if (type === DataType.Date) {
					return (
						<EnumDropdown enumeration={DateComparisonOperator} {...shared} />
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
		const columns = useTableColumnNames(table, columnFilter)
		const columnOptions = useSimpleDropdownOptions(columns)

		return (
			<Container>
				<SideBySide>
					{operatorDropdown}
					<FilterContainer>
						{type === DataType.Date ? (
							<CalendarPicker
								onSelectDate={onSelectDate}
								disabled={isEmpty}
								cleanLabel={cleanLabel}
							/>
						) : null}

						{type === DataType.String ? (
							<TextValue
								onChange={onChangeTextFieldValue}
								disabled={isEmpty}
							></TextValue>
						) : null}

						{type === DataType.Number ? (
							<SpinButton
								min={0}
								step={1}
								value={criterion.value}
								styles={spinStyles}
								disabled={isEmpty}
								onChange={spinButtonOnChange}
							/>
						) : null}

						{type === DataType.Boolean ? (
							<BooleanToggle
								defaultChecked
								onText="True"
								offText="False"
								onChange={onToggleChange}
								disabled={isEmpty}
							/>
						) : null}

						<OrLabel>or</OrLabel>

						{type === DataType.Date ? (
							<ColumnCriteriaCombobox
								options={columnOptions}
								onChange={handleDateComboBoxChange}
								disabled={isEmpty}
							/>
						) : (
							<ColumnCriteriaCombobox
								options={columnOptions}
								onChange={handleComboBoxChange}
								disabled={isEmpty}
							/>
						)}
					</FilterContainer>

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
