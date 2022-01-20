/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	TableStore,
	Step,
	InputColumnRecordArgs,
	Value,
	DataType,
	columnType,
} from '@data-wrangling-components/core'
import { IDropdownOption } from '@fluentui/react'
import { op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { set } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DropdownOptionChangeFunction, StepChangeFunction } from '../types'

const noop = (value?: string) => value
const num = (value?: string) => value && +value

/**
 * Make a basic set of string options from an array
 * @param list
 * @returns
 */
export function useSimpleOptions(list: string[]): IDropdownOption[] {
	return useMemo(
		() =>
			list.map(name => ({
				key: name,
				text: name,
			})),
		[list],
	)
}

/**
 * Creates a list of dropdown options from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param store
 * @returns
 */
export function useTableOptions(store?: TableStore): IDropdownOption[] {
	// we won't actually get an updated store reference, so we'll track
	// whether updates are needed using a change listener and flag
	const [dirty, setDirty] = useState<boolean>(true)
	const [list, setList] = useState<string[]>([])
	useEffect(() => {
		store?.addChangeListener(() => setDirty(true))
	}, [store, setDirty])
	useEffect(() => {
		if (dirty) {
			setDirty(false)
			setList(store?.list() || [])
		}
	}, [store, dirty, setDirty, setList])
	return useSimpleOptions(list)
}

/**
 * Creates a list of dropdown options for the columns in a table
 * @param table
 * @returns
 */
export function useTableColumnOptions(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
): IDropdownOption[] {
	return useSimpleOptions(table?.columnNames(filter) || [])
}

export function useColumnValueOptions(
	column: string,
	table: ColumnTable | undefined,
	values?: Value[],
	filter?: (value: Value) => boolean,
): IDropdownOption[] {
	const vals = useMemo(() => {
		if (!table) {
			return []
		}
		const list = values
			? values
			: table
					.rollup({
						[column]: op.array_agg(column),
					})
					.objects()[0][column]
		return filter ? list.filter(filter) : list
	}, [column, table, values, filter])
	return useSimpleOptions(vals)
}

/**
 * Creates a callback handler for changing the step based on a dropdown value.
 * This only handles basic cases where the dropdown option key can be set on the
 * step using an object path.
 */
export function useHandleDropdownChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
): DropdownOptionChangeFunction {
	return useCallback(
		(event, option) => {
			const update = {
				...step,
			}
			set(update, path, option?.key)
			onChange && onChange(update)
		},
		[step, path, onChange],
	)
}

export function useHandleTextfieldChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
	transformer = noop,
): (
	event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
	newValue?: string,
) => void {
	return useCallback(
		(event, newValue) => {
			const update = {
				...step,
			}
			const value = transformer(newValue)
			set(update, path, value)
			onChange && onChange(update)
		},
		[step, path, onChange, transformer],
	)
}

/**
 * Enforces numeric values for a SpinButton onChange.
 * @param step
 * @param path
 * @param onChange
 * @param transformer
 * @returns
 */
export function useHandleSpinButtonChange(
	step: Step,
	path: string,
	onChange?: StepChangeFunction,
	transformer = num,
): (event: React.SyntheticEvent<HTMLElement>, newValue?: string) => void {
	return useCallback(
		(event, newValue) => {
			const update = {
				...step,
			}
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
		(event, checked) => {
			const update = {
				...step,
			}
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
	name: string | undefined,
	table?: ColumnTable,
	store?: TableStore,
): ColumnTable | undefined {
	const [tbl, setTable] = useState<ColumnTable | undefined>()
	useEffect(() => {
		const fn = async (n: string, s: TableStore) => {
			try {
				s.listen(n, setTable)
				const t = await s.get(n)
				setTable(t)
			} catch (e) {
				// swallow the error - we may try to request async before the table is registered
				// it'll get picked up later by the listener
				// TODO: should we only listen if it fails at first?
			}
		}
		// if a table already exists, use it directly
		// TODO: should we set it in the store also?
		// the expectation here is that a table will be provided if the step component is used directly without a builder
		// interface that is managing a pipeline
		if (table) {
			setTable(table)
		} else if (name && store) {
			fn(name, store)
		}
		return () => {
			name && store && store.unlisten(name)
		}
	}, [name, table, store, setTable])
	return tbl
}

export function useIntersection(
	element: HTMLDivElement | undefined,
	rootMargin: string,
): boolean {
	const [isVisible, setState] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setState(entry.isIntersecting)
			},
			{ rootMargin },
		)
		element && observer.observe(element)

		return () => element && observer.unobserve(element)
	}, [element, rootMargin])

	return isVisible
}

export function useColumnType(table?: ColumnTable, column?: string): DataType {
	return useMemo(() => {
		if (!table || !column) {
			return DataType.Unknown
		}
		return columnType(table, column)
	}, [table, column])
}
