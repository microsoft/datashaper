/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useSubsetTable(
	table: ColumnTable,
	columns?: string[],
): ColumnTable {
	return useMemo(() => {
		if (columns && columns.length > 0) {
			return table.select(columns)
		}
		return table
	}, [table, columns])
}
