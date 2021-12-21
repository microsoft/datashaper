/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableMetadata, introspect } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
/**
 * Optionally executes a series of table characterization functions.
 * @param table
 * @param discover
 */
export function useTableMetadata(
	table: ColumnTable,
	discover = false,
): TableMetadata {
	return useMemo(() => {
		if (discover) {
			return introspect(table)
		}
		// don't expend any compute on detailed column meta unless asked
		return {
			rows: table.numRows(),
			cols: table.numCols(),
			columns: {},
		}
	}, [table, discover])
}
