/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@data-wrangling-components/core'
import { desc, internal as ArqueroTypes } from 'arquero'
import { useMemo } from 'react'

export function useSortedTable(
	table: ArqueroTypes.ColumnTable,
	column?: string,
	sort?: SortDirection,
): ArqueroTypes.ColumnTable {
	return useMemo(() => {
		if (!column || !sort) {
			return table.unorder()
		}
		return table.orderby(
			sort === SortDirection.Descending ? desc(column) : column,
		)
	}, [table, column, sort])
}
