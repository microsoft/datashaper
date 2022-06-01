/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

import type { InputColumnArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export interface SpreadArgs extends InputColumnArgs {
	to: string[]
	delimiter?: string
}

export const spreadStep: ColumnTableStep<SpreadArgs> = (
	input,
	{ to, column, delimiter },
) => {
	const split = applySplit(input, [column], delimiter)
	return split.spread(column, { as: to })
}

// if a delimiter is supplied, splits the cell values of every required column in the table
// into array values
function applySplit(
	table: ColumnTable,
	columns: string[],
	delimiter?: string,
): ColumnTable {
	if (delimiter) {
		const args = columns.reduce((acc, col) => {
			acc[col] = escape((d: any) => op.split(d[col], delimiter, undefined))
			return acc
		}, {} as Record<string, any>)
		return table.derive(args)
	}
	return table
}

export const spread = stepVerbFactory(spreadStep)
