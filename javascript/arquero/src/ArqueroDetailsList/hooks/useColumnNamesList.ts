/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

/**
 * Creates a list of column names for the table.
 * If there are no columns supplied or all = true, it will use the list from the table itself.
 * Otherwise it will use the provided columns under the assumption the user has configured them as desired.
 * @param table -
 * @param columns -
 * @param all -
 * @returns
 */
export function useColumnNamesList(
	table: ColumnTable,
	columns?: IColumn[],
	all = false,
	visibleColumns?: string[],
): string[] {
	return useMemo(() => {
		const list =
			!columns || all ? table.columnNames() : columns.map(c => c.name)
		if (visibleColumns && visibleColumns.length > 0) {
			const hash = visibleColumns.reduce((acc, cur) => {
				acc[cur] = true
				return acc
			}, {} as Record<string, boolean>)
			return list.filter(name => hash[name])
		}
		return list
	}, [table, columns, all, visibleColumns])
}
