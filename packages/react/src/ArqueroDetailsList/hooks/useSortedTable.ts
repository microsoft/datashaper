/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@data-wrangling-components/core'
import { desc } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useSortedTable(
	table: ColumnTable,
	column?: string,
	sort?: SortDirection,
): ColumnTable {
	return useMemo(() => {
		if (!column || !sort) {
			return table.unorder()
		}
		return table.orderby(
			sort === SortDirection.Descending ? desc(column) : column,
		)
	}, [table, column, sort])
}
