/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	BooleanComparisonOperator,
	DataType,
	DateComparisonOperator,
	ComparisonStrategy,
	NumericComparisonOperator,
	StringComparisonOperator,
} from '@datashaper/schema'
import { EnumDropdown } from '@essex/components'
import type { IComboBoxOption, IDropdownOption } from '@fluentui/react'
import { SpinButton } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'

import {
	useColumnNames,
	useSimpleDropdownOptions,
} from '../../../../hooks/index.js'
import {
	CalendarPicker,
	ColumnCriteriaComboBox,
} from '../../../controls/index.js'
import { dropdownStyles, narrowDropdownStyles } from '../../../styles.js'
import { InputExplainer, LeftAlignedRow } from '../styles.js'
import { useColumnTyping, useIsEmpty } from './FilterFunction.hooks.js'
import {
	BooleanToggle,
	Container,
	FilterContainer,
	Input,
	InputLabel,
	OrLabel,
	TextValue,
} from './FilterFunction.styles.js'
import type { FilterFunctionProps } from './FilterFunction.types.js'

/**
 * Just the comparison logic/ops for a filter.
 * Input table and source column is expected to be edited elsewhere and configured as the step input.
 * This is split out from FilterInputs to allow just the comparison logic to be reused elsewhere.
 */
export const FilterFunction: React.FC<FilterFunctionProps> = memo(
	function FilterFunction({ table, column, criteria, onChange }) {
		const handleOpChange = useCallback(
			(_e: React.FormEvent<HTMLDivElement>, opt?: IDropdownOption) => {
				onChange?.({
					...criteria,
					operator: opt?.key as
						| StringComparisonOperator
						| NumericComparisonOperator
						| BooleanComparisonOperator
						| DateComparisonOperator,
				})
			},
			[criteria, onChange],
		)

		const onSelectDate = useCallback(
			(date: Date): void => {
				const update = {
					...criteria,
					strategy: ComparisonStrategy.Value,
					value: date,
				}
				onChange?.(update)
				setCleanLabel(false)
			},
			[criteria, onChange],
		)

		const handleDateComboBoxChange = useCallback(
			(
				_e: any,
				option: IComboBoxOption | undefined,
				_index: number | undefined,
				value: string | undefined,
			) => {
				const update = {
					...criteria,
					strategy: ComparisonStrategy.Column,
					value: option ? option.key : value,
				}
				onChange?.(update)

				setCleanLabel(true)
			},
			[criteria, onChange],
		)

		const handleComboBoxChange = useCallback(
			(
				_e: any,
				option: IComboBoxOption | undefined,
				_index: number | undefined,
				value: string | undefined,
			) => {
				const update = {
					...criteria,
					strategy: ComparisonStrategy.Column,
					value: option ? option.key : value,
				}
				onChange?.(update)
			},
			[criteria, onChange],
		)

		const onChangeTextFieldValue = useCallback(
			(
				_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
				newValue?: string,
			) => {
				const update = {
					...criteria,
					strategy: ComparisonStrategy.Value,
					value: newValue,
				}
				onChange?.(update)
			},
			[criteria, onChange],
		)

		const spinButtonOnChange = useCallback(
			(_event: React.SyntheticEvent<HTMLElement>, newValue?: string) => {
				if (newValue != null) {
					const update = {
						...criteria,
						strategy: ComparisonStrategy.Value,
						value: newValue,
					}
					onChange?.(update)
				}
			},
			[criteria, onChange],
		)

		const onToggleChange = (
			_ev: React.MouseEvent<HTMLElement>,
			checked?: boolean,
		) => {
			const update = {
				...criteria,
				type: ComparisonStrategy.Value,
				value: checked,
			}
			onChange?.(update)
		}

		const { type, columnFilter } = useColumnTyping(table, column)
		const [cleanLabel, setCleanLabel] = useState<boolean>(false)

		const operatorDropdown = useMemo(() => {
			const shared = {
				label: '',
				placeholder: 'Choose',
				selectedKey: criteria.operator,
				onChange: handleOpChange,
				styles: dropdownStyles,
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
		}, [type, column, criteria, handleOpChange])

		const isEmpty = useIsEmpty(criteria)
		const columns = useColumnNames(table, columnFilter)
		const columnOptions = useSimpleDropdownOptions(columns)

		return (
			<Container>
				<LeftAlignedRow>{operatorDropdown}</LeftAlignedRow>

				<FilterContainer>
					<Input>
						<InputLabel>value</InputLabel>
						{type === DataType.Date ? (
							<CalendarPicker
								onSelectDate={onSelectDate}
								disabled={isEmpty}
								cleanLabel={cleanLabel}
							/>
						) : null}

						{type === DataType.String ? (
							<TextValue
								value={criteria.value}
								onChange={onChangeTextFieldValue}
								disabled={isEmpty}
							/>
						) : null}

						{type === DataType.Number ? (
							<SpinButton
								min={0}
								step={1}
								value={criteria.value}
								styles={narrowDropdownStyles}
								disabled={isEmpty}
								onChange={spinButtonOnChange}
							/>
						) : null}

						{type === DataType.Boolean ? (
							<BooleanToggle
								defaultChecked
								onText='True'
								offText='False'
								onChange={onToggleChange}
								disabled={isEmpty}
							/>
						) : null}
					</Input>
					<OrLabel>or</OrLabel>
					<Input>
						<InputLabel>column</InputLabel>
						{type === DataType.Date ? (
							<ColumnCriteriaComboBox
								options={columnOptions}
								onChange={handleDateComboBoxChange}
								disabled={isEmpty}
							/>
						) : (
							<ColumnCriteriaComboBox
								options={columnOptions}
								onChange={handleComboBoxChange}
								disabled={isEmpty}
							/>
						)}
					</Input>
				</FilterContainer>

				{type === DataType.String ? (
					<InputExplainer>
						String comparisons are not case-sensitive
					</InputExplainer>
				) : null}
			</Container>
		)
	},
)
