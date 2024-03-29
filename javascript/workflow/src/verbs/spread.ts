/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '@datashaper/schema'
import { escape, not, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const spreadStep: ColumnTableStep<SpreadArgs> = (
	input,
	{ to, column, delimiter, onehot, preserveSource = false },
) => {
	const split = applySplit(input, column, delimiter)
	const spread = onehot
		? applyOnehotSpread(split, column)
		: applyDefaultSpread(split, column, to)
	return preserveSource ? spread : spread.select(not(column))
}

// if a delimiter is supplied, splits the cell values of every required column in the table
// into array values
function applySplit(
	table: ColumnTable,
	column: string,
	delimiter?: string,
): ColumnTable {
	if (delimiter) {
		const dArgs = {
			[column]: escape((d: any) => op.split(d[column], delimiter, undefined)),
		}

		return table.derive(dArgs)
	}
	return table
}

// creates a default arquero spread operation for each column
// this ignores unique values and just creates a new column for each index value
// note also that arquero only inspects the first valid cell, it does not find the longest array
function applyDefaultSpread(table: ColumnTable, column: string, to?: string[]) {
	return table.spread(column, { as: to, drop: false })
}

// applies the onehot spread, assuming column cells already contain arrays
function applyOnehotSpread(table: ColumnTable, column: string): ColumnTable {
	// collect all of the unique values for each onehot column
	const hash = createUniqueColumnValuesHash(table, column)
	const values = hash[column] ?? {}
	const args = Object.keys(values)
		.sort()
		.reduce((acc, value) => {
			acc[`${column}_${value}`] = escape((d: any) => {
				return op.includes(d[column], value, undefined) ? 1 : 0
			})
			return acc
		}, {} as Record<string, any>)

	return table.derive(args)
}

// for each column, collect the unique values in a hash
function createUniqueColumnValuesHash(
	table: ColumnTable,
	column: string,
): Record<string, object> {
	// TODO: there's probably a more efficient method than unrolling everything first
	const unrolled = table.unroll(column)
	const args = {
		[column]: op.object_agg(column, column),
	}
	const collapsed = unrolled.rollup(args)
	return collapsed.object(0) as Record<string, object>
}

export const spread = stepVerbFactory(spreadStep)
