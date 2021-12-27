/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { op, bin as aqbin } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore, BinArgs, BinStrategy, Step } from '../..'
import { fixedBinCount, fixedBinStep } from '../util'

/**
 * Executes a bin aggregate, which effectively truncates values to a bin boundary for histograms.
 * @param step
 * @param store
 * @returns
 */
export async function bin(step: Step, store: TableStore): Promise<ColumnTable> {
	const { input, args } = step
	const { as } = args as BinArgs

	const inputTable = await store.get(input)

	const rArgs = {
		[`${as}`]: binExpr(inputTable, args as BinArgs),
	}

	return inputTable.derive(rArgs)
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
	const { strategy, field, fixedwidth, fixedcount, clamped } = args
	const stats = getStats(input, field, args.min, args.max)
	const [min, max] = stats
	switch (strategy) {
		case BinStrategy.Auto:
			// just let arquero do its thing
			return aqbin(field)
		case BinStrategy.FixedWidth:
			return fixedBinStep(field, min, max, fixedwidth || 1, clamped)
		case BinStrategy.FixedCount:
			return fixedBinCount(field, min, max, fixedcount || 1, clamped)
		default:
			throw new Error(`Unsupported bin strategy ${strategy}`)
	}
}

// compute the min/max from the table but allow user override of these bounds
function getStats(
	table: ColumnTable,
	field: string,
	min?: number,
	max?: number,
): [number, number] {
	const rollup = table.rollup({
		min: op.min(field),
		max: op.max(field),
	})
	const stats = rollup.objects()[0]
	return [min || stats.min, max || stats.max]
}
