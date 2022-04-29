/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '@data-wrangling-components/core'
import type { Value } from '@essex/arquero'
import type { IDropdownOption } from '@fluentui/react'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useEffect, useMemo, useState } from 'react'

/**
 * Make a basic set of string options from an array
 * @param list -
 * @returns
 */
export function useSimpleDropdownOptions(list: string[]): IDropdownOption[] {
	return useMemo(
		() =>
			list.map(name => ({
				key: name,
				text: name.toString(),
			})),
		[list],
	)
}

export function useEnumDropdownOptions<E = unknown>(
	enumeration: E,
	labels?: Record<string, string>,
): IDropdownOption[] {
	return useMemo(
		() => getEnumDropdownOptions(enumeration, labels),
		[enumeration, labels],
	)
}

export function getEnumDropdownOptions<E = unknown>(
	enumeration: E,
	labels?: Record<string, string>,
): IDropdownOption[] {
	const options = Object.entries(enumeration).map(entry => {
		const [name, key] = entry
		const text = (labels && labels[key]) || formatEnumName(name)
		return {
			key,
			text,
		}
	})
	return options
}

/**
 * Formats a TitleCase enum name into a friendly-readable string
 * E.g. "TitleCase" => "Title case"
 * @param name
 * @returns
 */
function formatEnumName(name: string): string {
	const parts = name
		.replace(/([A-Z])/g, ' $1')
		.trim()
		.split(/\s/)
	const first = parts[0]
	const rest = parts.slice(1).map(p => p.toLocaleLowerCase())
	return [first, ...rest].join(' ')
}

export function useDateFormatPatternOptions(): IDropdownOption[] {
	return useMemo(() => getDateFormatPatternOptions(), [])
}

export function getDateFormatPatternOptions(): IDropdownOption[] {
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

export function useTableColumnNames(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
) {
	return useMemo(() => table?.columnNames(filter) || [], [table])
}

export function useColumnValueOptions(
	column: string | undefined,
	table: ColumnTable | undefined,
	values?: Value[],
	filter?: (value: Value) => boolean,
): IDropdownOption[] {
	const vals = useMemo(() => {
		if (!column || !table || !column || column.trim().length === 0) {
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
	return useSimpleDropdownOptions(vals)
}

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
		return store?.onChange(() => setTimeout(() => setDirty(true), 0))
	}, [store, setDirty])
	useEffect(() => {
		if (dirty) {
			setDirty(false)
			setList(store?.list().sort() || [])
		}
	}, [store, dirty, setDirty, setList])
	return useSimpleDropdownOptions(list)
}
