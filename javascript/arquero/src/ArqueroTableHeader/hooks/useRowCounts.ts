/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useRowCounts(table: ColumnTable): {
	total: number
	visible: number
	hidden: number
} {
	return useMemo(() => {
		const total = table.totalRows()
		const visible = table.numRows()
		const hidden = total - visible
		return {
			total,
			visible,
			hidden,
		}
	}, [table])
}
