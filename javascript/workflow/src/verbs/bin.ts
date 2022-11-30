/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { BinStrategy } from '@datashaper/schema'
import { fixedBinStep } from '@datashaper/tables'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import {
	autoStrategy,
	doaneStrategy,
	fdStrategy,
	riceStrategy,
	scottStrategy,
	sqrtStrategy,
	sturgesStrategy,
} from './util/binUtilities.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

/**
 * Executes a bin aggregate, which effectively truncates values to a bin boundary for histograms.
 */
export const binStep: ColumnTableStep<BinArgs> = (input, args) => {
	return input.derive({
		[args.to]: binExpr(input, args),
	})
}

/**
 * Generate a bin expression that uses either auto or a fixed step
 * to force arquero to a predictable bin set.
 * https://uwdata.github.io/arquero/api/#bin
 */
function binExpr(input: ColumnTable, args: BinArgs) {
	const { column, clamped, printRange = false } = args
	const [min, max, step] = computeBins(input, args)
	return fixedBinStep(column, min, max, step, clamped, printRange)
}

function computeBins(input: ColumnTable, args: BinArgs) {
	const { strategy, column, fixedwidth, fixedcount } = args
	const stats = getStats(input, column, args.min, args.max)
	const [min, max] = stats
	switch (strategy) {
		case BinStrategy.Auto:
			return [min, max, autoStrategy(input.array(column))]
		case BinStrategy.Fd:
			return [min, max, fdStrategy(input.array(column))]
		case BinStrategy.Doane:
			return [min, max, doaneStrategy(input.array(column))]
		case BinStrategy.Scott:
			return [min, max, scottStrategy(input.array(column))]
		case BinStrategy.Rice:
			return [min, max, riceStrategy(input.array(column))]
		case BinStrategy.Sturges:
			return [min, max, sturgesStrategy(input.array(column))]
		case BinStrategy.Sqrt:
			return [min, max, sqrtStrategy(input.array(column))]
		case BinStrategy.FixedWidth:
			if (!fixedwidth) {
				throw new Error('Must supply a bin width')
			}
			return [min, max, fixedwidth]
		case BinStrategy.FixedCount:
			if (!fixedcount) {
				throw new Error('Must supply a bin count')
			}
			return [min, max, (max - min) / fixedcount]
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
): [number, number] {
	return [
		min ||
			table
				.rollup({
					min: op.min(column),
				})
				.get('min', 0),
		max ||
			table
				.rollup({
					max: op.max(column),
				})
				.get('max', 0),
	]
}

export const bin = stepVerbFactory(binStep)
