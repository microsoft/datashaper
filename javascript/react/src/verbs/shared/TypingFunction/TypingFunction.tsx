/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType } from '@data-wrangling-components/core'
import { types } from '@data-wrangling-components/core'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function getColumnType(
	table?: ColumnTable,
	column?: string,
): DataType | undefined {
	if (table !== undefined && column !== undefined) {
		const tps = table ? types(table) : {}
		const type: DataType | undefined = tps[column]

		return type
	}
	return undefined
}
