/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape, not, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

import type { InputColumnListArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export interface SpreadArgs extends InputColumnListArgs {
	to: string[]
	/**
	 * Delimiter to use when converting string cell values into an array with String.split
	 */
	delimiter?: string
	/**
	 * Indicates that a onehot-style spread should be performed.
	 * This maps all unique cell values to new columns and sets the output cell value to a binary 1/0 based on column match.
	 * This is in contrast to the default spread, which just maps array values to column by index.
	 */
	onehot?: boolean
}

export const spreadStep: ColumnTableStep<SpreadArgs> = (
	input,
	{ to, columns, delimiter, onehot },
) => {
	const split = applySplit(input, columns, delimiter)
	return onehot
		? applyOnehotSpread(split, columns)
		: applyDefaultSpread(split, columns, to)
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
			// TODO: expression type
		}, {} as Record<string, any>)
		return table.derive(args)
	}
	return table
}

// creates a default arquero spread operation for each column
// this ignores unique values and just creates a new column for each index value
// note also that arquero only inspects the first valid cell, it does not find the longest array
function applyDefaultSpread(
	table: ColumnTable,
	columns: string[],
	to?: string[],
) {
	return table.spread(columns, { as: to })
}

// applies the onehot spread, assuming column cells already contain arrays
function applyOnehotSpread(table: ColumnTable, columns: string[]): ColumnTable {
	// collect all of the unique values for each onehot column
	const hash = createUniqueColumnValuesHash(table, columns)
	const args = columns.reduce((acc, col) => {
		const values = hash[col]!
		Object.keys(values)
			.sort()
			.forEach((value: any) => {
				// each unique value should result in a new column
				acc[`${col}_${value}`] = escape((d: any) => {
					return op.includes(d[col], value, undefined) ? 1 : 0
				})
			})
		return acc
	}, {} as Record<string, any>)

	// note the final select: arquero's spread eliminates the original columns
	return table.derive(args).select(not(columns))
}

// for each column, collect the unique values in a hash
function createUniqueColumnValuesHash(
	table: ColumnTable,
	columns: string[],
): Record<string, object> {
	// TODO: there's probably a more efficient method than unrolling everything first
	const unrolled = table.unroll(columns)
	const args = columns.reduce((acc, col) => {
		acc[col] = op.object_agg(col, col)
		return acc
	}, {} as Record<string, object>)
	const collapsed = unrolled.rollup(args)
	return collapsed.object(0) as Record<string, object>
}

export const spread = stepVerbFactory(spreadStep)
