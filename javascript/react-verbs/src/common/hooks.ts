/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnRecordArgs,
	Step,
	TableStore,
} from '@data-wrangling-components/core'
import type { TableContainer } from '@essex/arquero'
import { columnType, DataType } from '@essex/arquero'
import type {
	IComboBox,
	IComboBoxOption,
	IDropdownOption,
} from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { produce } from 'immer'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { StepChangeFunction } from '../types.js'

// #region Dropdown Change Handler

export type DropdownChangeHandler = (
	event: React.FormEvent<HTMLDivElement>,
	option?: IDropdownOption,
	index?: number,
) => void

/**
 * Creates a callback handler for changing the step based on a dropdown value.
 * This only handles basic cases where the dropdown option key can be set on the
 * step using an object path.
 */
export function useDropdownChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, optionKey: string | number | undefined) => void,
	onChange?: StepChangeFunction<T>,
): DropdownChangeHandler {
	return useCallback(getDropdownChangeHandler(step, updateFn, onChange), [
		step,
		onChange,
		updateFn,
	])
}

export function getDropdownChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, optionKey: string | number | undefined) => void,
	onChange?: StepChangeFunction<T>,
): DropdownChangeHandler {
	return (_event, option) => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, option?.key)
			}),
		)
	}
}

// #endregion

// #region ComboBox Change Handler

export type ComboBoxChangeHandler = (
	event: React.FormEvent<IComboBox>,
	option: IComboBoxOption | undefined,
	index: number | undefined,
	value?: string | undefined,
) => void

/**
 * Creates a callback handler for changing the step based on a combobox value.
 * This only handles basic cases where the combobox option key can be set on the
 * step using an object path.
 */
export function useComboBoxChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (
		step: Step<T>,
		optionKey: string | number | undefined,
		value: string | undefined,
	) => void,
	onChange?: StepChangeFunction<T>,
): ComboBoxChangeHandler {
	return useCallback(getComboBoxChangeHandler(step, updateFn, onChange), [
		step,
		onChange,
		updateFn,
	])
}

export function getComboBoxChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (
		step: Step<T>,
		optionKey: string | number | undefined,
		value: string | undefined,
	) => void,
	onChange?: StepChangeFunction<T>,
): ComboBoxChangeHandler {
	return (_event, option, _index, value) => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, option?.key, value)
			}),
		)
	}
}

// #endregion

// #region ComboBox Change Handler

export type ComboBoxInputValueChangeHandler = (
	value?: string | undefined,
) => void

/**
 * Creates a callback handler for changing the step based on a combobox value.
 * This only handles basic cases where the combobox option key can be set on the
 * step using an object path.
 */
export function useComboBoxInputValueChangeHandler<
	T extends object | void | unknown,
>(
	step: Step<T>,
	updateFn: (step: Step<T>, value: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): ComboBoxInputValueChangeHandler {
	return useCallback(
		getComboBoxInputValueChangeHandler(step, updateFn, onChange),
		[step, onChange, updateFn],
	)
}

export function getComboBoxInputValueChangeHandler<
	T extends object | void | unknown,
>(
	step: Step<T>,
	updateFn: (step: Step<T>, value: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): ComboBoxInputValueChangeHandler {
	return value => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, value)
			}),
		)
	}
}

// #endregion

// #region Textfield Change Handler

export type TextFieldChangeHandler = (
	event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	newValue?: string,
) => void

export function useTextFieldChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, updated: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): TextFieldChangeHandler {
	return useCallback(getTextFieldChangeHandler(step, updateFn, onChange), [
		step,
		updateFn,
		onChange,
	])
}
export function getTextFieldChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, updated: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): TextFieldChangeHandler {
	return (_event, newValue) => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, newValue)
			}),
		)
	}
}

// #endregion

// #region Spinbutton Change Handler

export type SpinButtonChangeHandler = (
	event: React.SyntheticEvent<HTMLElement>,
	newValue?: string,
) => void

/**
 * Enforces numeric values for a SpinButton onChange.
 * @param step - the step object
 * @param updateFn - the update function
 * @param onChange -the onchange handler
 * @returns
 */
export function useSpinButtonChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): SpinButtonChangeHandler {
	return useCallback(getSpinButtonChangeHandler(step, updateFn, onChange), [
		step,
		onChange,
		updateFn,
	])
}
export function getSpinButtonChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): SpinButtonChangeHandler {
	return (_event, newValue) => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, newValue)
			}),
		)
	}
}

// #endregion

// #region Checkbox Change Handler

export type CheckboxChangeHandler = (
	event?: React.FormEvent<HTMLElement | HTMLInputElement>,
	checked?: boolean,
) => void

export function useCheckboxChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: boolean | undefined) => void,
	onChange?: StepChangeFunction<T>,
): CheckboxChangeHandler {
	return useCallback(getCheckboxChangeHandler(step, updateFn, onChange), [
		step,
		updateFn,
		onChange,
	])
}
export function getCheckboxChangeHandler<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: boolean | undefined) => void,
	onChange?: StepChangeFunction<T>,
): CheckboxChangeHandler {
	return (_event, checked) => {
		onChange?.(
			produce(step, draft => {
				updateFn(draft as Step<T>, checked)
			}),
		)
	}
}

// #endregion

export function useColumnRecordDelete(
	step: Step<InputColumnRecordArgs>,
	onChange?: StepChangeFunction<InputColumnRecordArgs>,
): (column: string) => void {
	return useCallback(
		column => {
			const args = { ...step.args }
			delete args.columns[column]

			onChange?.({
				...step,
				args: {
					...step.args,
					...args,
				},
			})
		},
		[step, onChange],
	)
}

export function useLoadTable(
	id: string | undefined,
	table?: ColumnTable,
	store?: TableStore,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>()
	const handleTableLoad = useCallback(
		(container: TableContainer | undefined) => setTable(container?.table),
		[setTable],
	)
	useEffect(() => {
		// if a table already exists, use it directly
		// TODO: should we set it in the store also?
		// the expectation here is that a table will be provided if the step component is used directly without a builder
		// interface that is managing a pipeline
		if (table) {
			setTable(table)
		} else if (id && store) {
			const sub = store.observe(id).subscribe(t => setTable(t?.table))
			return () => sub.unsubscribe()
		}
	}, [id, table, store, handleTableLoad])
	return tbl
}

export function useColumnType(table?: ColumnTable, column?: string): DataType {
	return useMemo(() => {
		if (!table || !column) {
			return DataType.Unknown
		}
		return columnType(table, column)
	}, [table, column])
}
