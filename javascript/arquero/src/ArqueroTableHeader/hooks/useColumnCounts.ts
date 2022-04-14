/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useColumnCounts(
	table: ColumnTable,
	visibleColumns?: string[],
): {
	total: number
	visible: number
	hidden: number
} {
	return useMemo(() => {
		const total = table.numCols()
		const visible = visibleColumns ? visibleColumns.length : total
		const hidden = total - visible
		return {
			total,
			visible,
			hidden,
		}
	}, [table, visibleColumns])
}
