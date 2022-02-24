/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useSlicedTable(
	table: ColumnTable,
	offset: number,
	limit: number,
): ColumnTable {
	return useMemo(() => {
		if (offset === 0 && limit === Infinity) {
			return table
		}
		return table.slice(offset, offset + limit)
	}, [table, limit, offset])
}
