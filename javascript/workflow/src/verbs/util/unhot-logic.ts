/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

/**
 * This maps the binary 1/0 values in a column to the column name as part of reversing a onehot.
 * @param input
 * @param columns
 * @param prefix
 * @returns
 */
export function unhotOperation(
	input: ColumnTable,
	columns: string[],
	prefix = '',
): ColumnTable {
	const args = columns.reduce((acc, cur) => {
		const pxp = new RegExp(`^${prefix}`)
		const value = cur.replace(pxp, '')
		acc[cur] = escape((d: any) => (d[cur] === 1 ? value : null))
		return acc
	}, {} as Record<string, object>)

	return input.derive(args)
}
