/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { bin as aqbin, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../factories.js'
import type { BinArgs, Step, TableStore } from '../../index.js'
import { BinStrategy } from '../../index.js'
import type { TableContainer } from '../../types.js'
import { fixedBinCount, fixedBinStep } from '../util/index.js'

/**
 * Executes a bin aggregate, which effectively truncates values to a bin boundary for histograms.
 * @param step
 * @param store
 * @returns
 */
export async function bin(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { to } = args as BinArgs

	const inputTable = await store.table(input)

	const rArgs = {
		[to]: binExpr(inputTable, args as BinArgs),
	}

	return container(output, inputTable.derive(rArgs))
}

/**
 * Generate a bin expression that uses either auto or a fixed step
 * to force arquero to a predictable bin set.
 * https://uwdata.github.io/arquero/api/#bin
 * @param input
 * @param args
 * @returns
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
