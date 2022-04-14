/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useSubsetTable(
	table: ColumnTable,
	columns?: string[],
): ColumnTable {
	return useMemo(() => {
		if (columns && columns.length > 0) {
			// for some reason, it updates here first when changing a table.
			// doing this stops the super error from arquero while the real columns aren't re-rendered
			const tableColumns = table.columnNames()
			const existingColumnNames = columns.filter(x => tableColumns.includes(x))
			return table.select(existingColumnNames)
		}
		return table
	}, [table, columns])
}
