/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { columnType, DataType } from '@essex/arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

export function useColumnsMetadata(
	table: ColumnTable | undefined,
	filter?: (name: string) => boolean,
): ColumnMetadata[] {
    const columns = table?.columnNames(filter) || []
    let result: ColumnMetadata[] = []

    columns.forEach(col => {
        let type: DataType

        if (!table || !col) {
			type = DataType.Unknown
		}
        else
            type = columnType(table, col)

        result.push({columnName: col, type: type})
    })
	return useMemo(() => result, [table, filter])
}

export interface ColumnMetadata{
    columnName: string,
    type: DataType
}