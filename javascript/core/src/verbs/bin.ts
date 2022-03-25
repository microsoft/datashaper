/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { bin as aqbin, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnArgs, OutputColumnArgs } from './types.js'
import { fixedBinCount, fixedBinStep } from './util/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export enum BinStrategy {
	Auto = 'auto',
	FixedCount = 'fixed count',
	FixedWidth = 'fixed width',
}

export interface BinArgs extends InputColumnArgs, OutputColumnArgs {
	strategy: BinStrategy
	/**
	 * Fixed number of bins.
	 * Note that the bin placements are inclusive of the bottom boundary and exclusive of the top boundary -
	 * this means there is always one extra bin for the max value when using fixed count.
	 */
	fixedcount?: number
	/**
	 * Exact step size between bins
	 */
	fixedwidth?: number
	/**
	 * Min boundary to categorize values into.
	 * If cell values are below this, they will default to -Infinity unless clamped.
	 */
	min?: number
	/**
	 * Max boundary to categorize values into.
	 * If cell values are above this, they will default to +Infinity unless clamped.
	 */
	max?: number
	/**
	 * If true, values outside of the min/max boundaries will be clamped to those
	 * boundaries rather than +/-Infinity.
	 */
	clamped?: boolean
}
/**
 * Executes a bin aggregate, which effectively truncates values to a bin boundary for histograms.
 */
export const binStep: TableStep<BinArgs> = (input, args) =>
	input.derive({
		[args.to]: binExpr(input, args),
	})

/**
 * Generate a bin expression that uses either auto or a fixed step
 * to force arquero to a predictable bin set.
 * https://uwdata.github.io/arquero/api/#bin
 */
function binExpr(input: ColumnTable, args: BinArgs) {
	const { strategy, column, fixedwidth, fixedcount, clamped } = args
	const stats = getStats(input, column, args.min, args.max)
	const [min, max, distinct] = stats
	switch (strategy) {
		case BinStrategy.Auto:
			// just let arquero do its thing
			return aqbin(column)
		case BinStrategy.FixedWidth:
			return fixedBinStep(column, min, max, fixedwidth || 1, clamped, distinct)
		case BinStrategy.FixedCount:
			return fixedBinCount(column, min, max, fixedcount || 1, clamped, distinct)
		default:
			throw new Error(`Unsupported bin strategy ${strategy}`)
	}
}

// compute the min/max from the table but allow user override of these bounds
function getStats(
	table: ColumnTable,
	column: string,
	min?: number,
	max?: number,
): [number, number, number] {
	const rollup = table.rollup({
		min: op.min(column),
		max: op.max(column),
		distinct: op.distinct(column),
	})
	return [
		min || rollup.get('min', 0),
		max || rollup.get('max', 0),
		rollup.get('distinct', 0),
	]
}

export const bin = stepNodeFactory(binStep)
