/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { columnType, DataType } from '@datashaper/arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useColumnsMetadata(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
): ColumnMetadata[] {
	return useMemo(() => {
		const columns = table?.columnNames(filter) || []
		const result: ColumnMetadata[] = columns.map(col => {
			const type: DataType =
				!table || !col ? DataType.Unknown : columnType(table, col)
			return { columnName: col, type: type }
		})
		return result
	}, [table, filter])
}

export interface ColumnMetadata {
	columnName: string
	type: DataType
}
