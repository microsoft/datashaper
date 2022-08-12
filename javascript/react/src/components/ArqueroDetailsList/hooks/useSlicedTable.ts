/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { sliceTable } from '@datashaper/arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useSlicedTable(
	table: ColumnTable,
	offset: number,
	limit: number,
): ColumnTable {
	return useMemo(() => sliceTable(table, offset, limit), [table, offset, limit])
}
