/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@data-wrangling-components/core'
import * as aq from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useSortedTable(
	table: ColumnTable,
	column?: string,
	sort?: SortDirection,
): ColumnTable {
	return useMemo(() => {
		let columns: string[] = []
		if ((!column || !sort) && !table.isGrouped()) {
			return table.unorder()
		} else if (column) {
			columns.push(column)
		}

		if (table.isGrouped()) {
			columns = [...table.groups().names, ...columns]
		}

		return table.orderby(
			sort === SortDirection.Descending
				? columns.map(col => aq.desc(col))
				: columns,
		)
	}, [table, column, sort])
}
