/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@essex/arquero'
import type { IDropdownOption } from '@fluentui/react'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

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

/**
 * Creates a list of dropdown options for the columns in a table
 * @param table - the input table
 * @returns a list of dropdown options
 */
export function useTableColumnOptions(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
): IDropdownOption[] {
	return useSimpleDropdownOptions(table?.columnNames(filter) || [])
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
