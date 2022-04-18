/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType } from '@essex/arquero'
import { columnTypes } from '@essex/arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function getColumnType(
	table?: ColumnTable,
	column?: string,
): DataType | undefined {
	if (table !== undefined && column !== undefined) {
		const tps = table ? columnTypes(table) : {}
		const type: DataType | undefined = tps[column]

		return type
	}
	return undefined
}
