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
import type { IDropdownOption } from '@fluentui/react'
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
export function useHandleDropdownChange<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, optionKey: string | number | undefined) => void,
	onChange?: StepChangeFunction<T>,
): DropdownChangeHandler {
	return useCallback(
		(_event, option) => {
			onChange?.(
				produce(step, draft => {
					updateFn(draft as Step<T>, option?.key)
				}),
			)
		},
		[step, onChange, updateFn],
	)
}

// #endregion

// #region Textfield Change Handler

export type TextFieldChangeHandler = (
	event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	newValue?: string,
) => void

export function useHandleTextFieldChange<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, updated: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): TextFieldChangeHandler {
	return useCallback(
		(_event, newValue) => {
			onChange?.(
				produce(step, draft => {
					updateFn(draft as Step<T>, newValue)
				}),
			)
		},
		[step, updateFn, onChange],
	)
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
export function useHandleSpinButtonChange<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: string | undefined) => void,
	onChange?: StepChangeFunction<T>,
): SpinButtonChangeHandler {
	return useCallback(
		(_event, newValue) => {
			onChange?.(
				produce(step, draft => {
					updateFn(draft as Step<T>, newValue)
				}),
			)
		},
		[step, onChange, updateFn],
	)
}

// #endregion

// #region Checkbox Change Handler

export type CheckboxChangeHandler = (
	event?: React.FormEvent<HTMLElement | HTMLInputElement>,
	checked?: boolean,
) => void

export function useHandleCheckboxChange<T extends object | void | unknown>(
	step: Step<T>,
	updateFn: (step: Step<T>, newValue: boolean | undefined) => void,
	onChange?: StepChangeFunction<T>,
): CheckboxChangeHandler {
	return useCallback(
		(_event, checked) => {
			onChange?.(
				produce(step, draft => {
					updateFn(draft as Step<T>, checked)
				}),
			)
		},
		[step, updateFn, onChange],
	)
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
