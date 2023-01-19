/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import isNil from 'lodash-es/isNil.js'

const identity = (d: any) => d
const str = (d: any) => (isNil(d) ? '' : `${d}`)

export interface RowsOptions {
	/**
	 * Indicates whether to skip the column headers as first row.
	 */
	skipHeader?: boolean
	/**
	 * Indicates whether to save each cell value as a string.
	 * Note that this just wraps in a template and does not attempt any formatting.
	 */
	stringify?: boolean
	/**
	 * Map of custom formatting functions per column.
	 */
	format?: Record<string, ((d: any) => any) | undefined>
}

/**
 * Returns a table's rows as a two-dimensional array.
 * @param table -
 * @param options -
 * @returns
 */
export function rows(table: ColumnTable, options?: RowsOptions): any[][] {
	const { skipHeader = false, stringify = false, format = {} } = options || {}
	const output = skipHeader ? [] : [table.columnNames()]
	table.scan((idx) => {
		const row: any[] = []
		for (let i = 0; i < table.numCols(); i++) {
			const name = table.columnName(i)
			const value = table.columnAt(i)?.get(idx)
			const formatFn = format[name]
			const fn = formatFn ? formatFn : stringify ? str : identity
			row.push(fn(value))
		}
		output.push(row)
	}, true)
	return output
}
