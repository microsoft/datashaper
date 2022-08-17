/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { columnType } from './columns.js'

// arquero uses 1000 as default, but we're sampling the table so assuming higher odds of valid values
const SAMPLE_MAX = 100

/**
 * Generates column typings info for a table.
 * @param table -
 * @returns
 */
export function columnTypes(
	table: ColumnTable,
	columns?: string[],
): Record<string, DataType> {
	const selected = columns ? table.select(columns) : table
	const sampled = selected.sample(SAMPLE_MAX)
	return sampled.columnNames().reduce((acc, cur) => {
		acc[cur] = columnType(table, cur)
		return acc
	}, {} as Record<string, DataType>)
}
