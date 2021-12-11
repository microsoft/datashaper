/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { internal as ArqueroTypes, op, bin as aqbin } from 'arquero'
import { TableStore, BinArgs, BinStrategy, Step } from '../..'

/**
 * Executes a bin aggregate, which effectively truncates values to a bin boundary for histograms.
 * @param step
 * @param store
 * @returns
 */
export async function bin(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { as } = args as BinArgs

	const inputTable = await store.get(input)

	const rArgs = {
		[`${as}`]: binExpr(inputTable, args as BinArgs),
	}

	return inputTable.derive(rArgs)
}

type Stats = {
	min: number
	max: number
}

/**
 * Generate a bin expression that uses either auto or a fixed step
 * to force arquero to a predictable bin set.
 * https://uwdata.github.io/arquero/api/#bin
 * @param input
 * @param args
 * @returns
 */
function binExpr(input: ArqueroTypes.ColumnTable, args: BinArgs) {
	const { strategy, field, fixedsize, fixedcount, min, max, clamped } = args
	const stats = getStats(input, field, min, max)
	switch (strategy) {
		case BinStrategy.Auto:
			// just let arquero do its thing
			return aqbin(field)
		case BinStrategy.FixedWidth:
			return fixedStepExpr(field, stats, fixedsize || 1, clamped)
		case BinStrategy.FixedCount:
			return fixedCountExpr(field, stats, fixedcount || 1, clamped)
		default:
			throw new Error(`Unsupported bin strategy ${strategy}`)
	}
}

function fixedCountExpr(
	field: string,
	stats: Stats,
	count: number,
	clamped?: boolean,
) {
	const { min, max } = stats
	const step = (max - min) / count
	return coreExpr(field, min, max, step, clamped)
}

function fixedStepExpr(
	field: string,
	stats: Stats,
	step: number,
	clamped?: boolean,
) {
	return coreExpr(field, stats.min, stats.max, step, clamped)
}

function coreExpr(
	field: string,
	min: number,
	max: number,
	step: number,
	clamped?: boolean,
) {
	const core = `op.bin(d['${field}'],${min},${max},${step})`
	if (clamped) {
		return `d['${field}'] < ${min} ? ${min} : d['${field}'] > ${max} ? ${max} : ${core}`
	}
	return core
}

// compute the min/max from the table but allow user override of these bounds
function getStats(
	table: ArqueroTypes.ColumnTable,
	field: string,
	min?: number,
	max?: number,
) {
	const rollup = table.rollup({
		min: op.min(field),
		max: op.max(field),
	})
	const stats = rollup.objects()[0]
	return {
		min: min || stats.min,
		max: max || stats.max,
	}
}
