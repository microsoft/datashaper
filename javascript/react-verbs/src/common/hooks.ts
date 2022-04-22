/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnRecordArgs,
	Step,
	TableStore,
} from '@data-wrangling-components/core'
import { identity, num } from '@data-wrangling-components/primitives'
import type { TableContainer } from '@essex/arquero'
import { columnType, DataType } from '@essex/arquero'
import type { IDropdownOption } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash-es/cloneDeep.js'
import set from 'lodash-es/set.js'
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
	path: string,
	onChange?: StepChangeFunction<T>,
): DropdownChangeHandler {
	return useCallback(
		(_event, option) => {
			const update = cloneDeep(step)
			set(update, path, option?.key)
			onChange?.(update)
		},
		[step, path, onChange],
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
	path: string,
	onChange?: StepChangeFunction<T>,
	transformer = identity,
): TextFieldChangeHandler {
	return useCallback(
		(_event, newValue) => {
			const update = cloneDeep(step)
			const value = transformer(newValue)
			set(update, path, value)
			onChange?.(update)
		},
		[step, path, onChange, transformer],
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
 * @param step -
 * @param path -
 * @param onChange -
 * @param transformer -
 * @returns
 */
export function useHandleSpinButtonChange<T extends object | void | unknown>(
	step: Step<T>,
	path: string,
	onChange?: StepChangeFunction<T>,
	transformer = num,
): SpinButtonChangeHandler {
	return useCallback(
		(_event, newValue) => {
			const update = cloneDeep(step)
			const value = transformer(newValue)
			if (typeof value === 'number') {
				set(update, path, value)
				onChange?.(update)
			}
		},
		[step, path, onChange, transformer],
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
	path: string,
	onChange?: StepChangeFunction<T>,
): CheckboxChangeHandler {
	return useCallback(
		(_event, checked) => {
			const update = cloneDeep(step)
			set(update, path, checked)
			onChange?.(update)
		},
		[step, path, onChange],
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
