/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import uniqueId from 'lodash-es/uniqueId.js'

import { columnTypes } from './columnTypes.js'
import { determineType } from './data.js'
import { stats } from './stats.js'
import type { TableMetadata } from './types.js'

/**
 * Performs type inference and stats on a table/columns.
 * @param table -
 * @param detailed - include detailed per-column stats, otherwise just basic types
 * @returns
 */
export function introspect(
	table: ColumnTable,
	detailed = false,
	/**
	 * List of specific columns to compute, enabling incremental table updates
	 */
	columns?: string[],
): TableMetadata {
	const meta = detailed
		? detailedMeta(table, columns)
		: basicMeta(table, columns)
	return {
		rows: table.numRows(),
		cols: table.numCols(),
		columns: meta,
	}
}
function detailedMeta(
	table: ColumnTable,
	columns?: string[],
): Record<string, Field> {
	// Force to get stats from ungrouped table, otherwise will get stats with grouped information and graph will not show
	const sts = stats(table.ungroup(), columns)
	return Object.entries(sts).reduce((acc, cur) => {
		const [name, stat] = cur
		const type = determineType(stat.mode)
		acc[name] = {
			id: uniqueId(),
			name,
			type,
			metadata: stat,
		}
		return acc
	}, {} as Record<string, Field>)
}

function basicMeta(
	table: ColumnTable,
	columns?: string[],
): Record<string, Field> {
	// Force to get stats from ungrouped table, otherwise will get stats with grouped information and graph will not show
	const t = columnTypes(table.ungroup(), columns)
	return Object.entries(t).reduce((acc, cur) => {
		const [name, type] = cur
		acc[name] = {
			id: uniqueId(),
			name,
			type,
		}
		return acc
	}, {} as Record<string, Field>)
}
