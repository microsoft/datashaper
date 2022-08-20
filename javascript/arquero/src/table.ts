/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

/**
 * Safely applies slicing args to a table
 * @param table - the column table
 * @param offset - the slice offset
 * @param limit - the slice length
 * @returns
 */
export function sliceTable(
	table: ColumnTable,
	offset: number,
	limit: number,
): ColumnTable {
	if (offset === 0 && limit === Infinity) {
		return table
	}
	return table.slice(offset, offset + limit)
}
