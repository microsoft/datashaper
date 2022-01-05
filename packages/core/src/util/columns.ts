/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'

/**
 * Returns a map of all of the column getters for a table.
 */
export function getters(
	table: ColumnTable,
): Record<string, (i: number) => any> {
	return table.columnNames().reduce((acc, cur) => {
		acc[cur] = table.getter(cur)
		return acc
	}, {} as Record<string, (i: number) => any>)
}

/**
 * Returns a list of column indices that contain at least one 0.
 * @param table
 */
export function columnIndexesWithZeros(table: ColumnTable): number[] {
	return table.columnNames().reduce((acc, name, idx) => {
		const values = table.array(name)
		if (values.some(v => v === 0)) {
			acc.push(idx)
		}
		return acc
	}, [] as number[])
}

/**
 * Returns a list of column names that contain at least one 0.
 * @param table
 * @returns
 */
export function columnNamesWithZeros(table: ColumnTable): string[] {
	const indexes = columnIndexesWithZeros(table)
	return indexes.map(i => table.columnName(i))
}
