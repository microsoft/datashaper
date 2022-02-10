/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SortDirection } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { RowObject } from 'arquero/dist/types/table/table'
import { useMemo } from 'react'
/**
 * Sort top level group headers if the table is grouped, there isn't any column sorted or
 * if the respective column is sorted
 * @param table
 * @param column
 * @param sort
 * @param entries
 * @returns RowObject[] | undefined
 */
export function useSortedGroups(
	table: ColumnTable,
	column?: string,
	sort = SortDirection.Ascending,
	entries?: RowObject[],
): RowObject[] | undefined {
	return useMemo(() => {
		if (!table.isGrouped()) return undefined

		const firstColumn = table.groups().names[0]
		if (column && column !== firstColumn) return entries
		return sort === SortDirection.Ascending
			? entries?.sort()
			: entries?.sort().reverse()
	}, [column, entries, sort, table])
}
