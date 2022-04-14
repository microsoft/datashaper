/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { format } from 'd3-format'
import isNil from 'lodash-es/isNil.js'

export function formatNumber(
	value: number | undefined,
	formatter: string | undefined,
): string {
	if (isNil(value)) {
		return ''
	}
	if (formatter) {
		const f = format(formatter)
		return f(value)
	}
	return value.toString()
}

export function sliceTable(
	table: ColumnTable,
	offset: number,
	limit: number,
): ColumnTable {
	if (offset === 0 && limit === Infinity) {
		return table
	}
	return table.slice(offset, offset + limit)
}
