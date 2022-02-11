/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useRowCounts(
	table: ColumnTable,
	visibleRows?: number,
): {
	total: number
	visible: number
	hidden: number
} {
	return useMemo(() => {
		const total = table.numRows()
		const visible = visibleRows ? visibleRows : total
		const hidden = total - visible
		return {
			total,
			visible,
			hidden,
		}
	}, [table, visibleRows])
}
