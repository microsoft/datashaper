/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore, Value } from '@data-wrangling-components/core'
import type { IDropdownOption } from '@fluentui/react'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useMemo, useState } from 'react'

/**
 * Creates a list of dropdown options from the tables in a store
 * TODO: for any given step, we should only show the tables created *prior* to this step,
 * potentially via an optional filter callback on store.list.
 * As it is, whenever the store is updated all the table dropdowns get the results.
 * @param store -
 * @returns
 */
export function useTableOptions(store?: TableStore): IDropdownOption[] {
	// we won't actually get an updated store reference, so we'll track
	// whether updates are needed using a change listener and flag
	const [dirty, setDirty] = useState<boolean>(true)
	const [list, setList] = useState<string[]>([])
	useEffect(() => {
		return store?.onChange(() => setDirty(true))
	}, [store, setDirty])
	useEffect(() => {
		if (dirty) {
			setDirty(false)
			setList(store?.list().sort() || [])
		}
	}, [store, dirty, setDirty, setList])
	return useSimpleOptions(list)
}

/**
 * Make a basic set of string options from an array
 * @param list -
 * @returns
 */
function useSimpleOptions(list: string[]): IDropdownOption[] {
	return useMemo(
		() =>
			list.map(name => ({
				key: name,
				text: name.toString(),
			})),
		[list],
	)
}

/**
 * Creates a list of dropdown options for the columns in a table
 * @param table - the input table
 * @returns a list of dropdown options
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
		if (!table || !column || column.trim().length === 0) {
			return []
		}
		const getFallback = () => {
			const columnNamesArray: string[] = table
				.columnNames()
				.filter(e => e === column)

			if (columnNamesArray.length !== 0) {
				const result: any[] = table
					.rollup({
						[column]: op.array_agg_distinct(column),
					})
					.get(column, 0)

				return result ?? []
			}

			return []
		}
		const list = values ? values : getFallback()
		return filter ? list.filter(filter) : list
	}, [column, table, values, filter])
	return useSimpleOptions(vals)
}

export function useDateFormatPatternOptions(): IDropdownOption[] {
	const formatPatternArray: IDropdownOption[] = [
		{ key: '%Y-%m-%d', text: '%Y-%m-%d' },
		{ key: '%Y/%m/%d', text: '%Y/%m/%d' },
		{ key: '%B %d, %Y', text: '%B %d, %Y' },
		{ key: '%m-%d-%Y', text: '%m-%d-%Y' },
		{ key: '%m/%d/%Y', text: '%m/%d/%Y' },
		{ key: '%d-%m-%Y', text: '%d-%m-%Y' },
		{ key: '%d/%m/%Y', text: '%d/%m/%Y' },
		{ key: '%Y-%m-%dT%H:%M:%S.%LZ', text: 'ISO 8601 (%Y-%m-%dT%H:%M:%S.%LZ)' },
	]
	return formatPatternArray
}

export function useIntersection(
	element: HTMLDivElement | undefined,
	rootMargin: string,
): boolean {
	const [isVisible, setState] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setState(entry?.isIntersecting ?? false)
			},
			{ rootMargin },
		)
		element && observer.observe(element)

		return () => element && observer.unobserve(element)
	}, [element, rootMargin])

	return isVisible
}
