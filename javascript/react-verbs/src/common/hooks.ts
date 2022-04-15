/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	InputColumnRecordArgs,
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { columnType, DataType } from '@data-wrangling-components/core'
import type {
	DropdownOptionChangeFunction,
	StepChangeFunction,
} from '@data-wrangling-components/react-controls'
import { identity, noop, num } from '@data-wrangling-components/react-controls'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash-es/cloneDeep.js'
import set from 'lodash-es/set.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Creates a callback handler for changing the step based on a dropdown value.
 * This only handles basic cases where the dropdown option key can be set on the
 * step using an object path.
 */
export function useHandleDropdownChange(
	step: Step,
	path: string,
	onChange: StepChangeFunction = noop,
): DropdownOptionChangeFunction {
	return useCallback(
		(_event, option) => {
			const update = cloneDeep(step)
			set(update, path, option?.key)
			onChange(update)
		},
		[step, path, onChange],
	)
}

export function useHandleTextfieldChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
	transformer = identity,
): (
	event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	newValue?: string,
) => void {
	return useCallback(
		(_event, newValue) => {
			const update = cloneDeep(step)
			const value = transformer(newValue)
			set(update, path, value)
			onChange && onChange(update)
		},
		[step, path, onChange, transformer],
	)
}

/**
 * Enforces numeric values for a SpinButton onChange.
 * @param step -
 * @param path -
 * @param onChange -
 * @param transformer -
 * @returns
 */
export function useHandleSpinButtonChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
	transformer = num,
): (event: React.SyntheticEvent<HTMLElement>, newValue?: string) => void {
	return useCallback(
		(_event, newValue) => {
			const update = cloneDeep(step)
			const value = transformer(newValue)
			if (typeof value === 'number') {
				set(update, path, value)
				onChange && onChange(update)
			}
		},
		[step, path, onChange, transformer],
	)
}

export function useHandleCheckboxChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
): (
	event?: React.FormEvent<HTMLElement | HTMLInputElement>,
	checked?: boolean,
) => void {
	return useCallback(
		(_event, checked) => {
			const update = cloneDeep(step)
			set(update, path, checked)
			onChange && onChange(update)
		},
		[step, path, onChange],
	)
}

export function useColumnRecordDelete(
	step: Step,
	onChange?: StepChangeFunction,
): (column: string) => void {
	return useCallback(
		column => {
			const internal = step as Step<InputColumnRecordArgs>
			const args = { ...internal.args }
			delete args.columns[column]
			onChange &&
				onChange({
					...step,
					args: {
						...internal.args,
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
