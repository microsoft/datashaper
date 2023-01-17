/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { BinStrategy } from '@datashaper/schema'
import { fixedBinStep } from '@datashaper/tables'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { default as linspace } from 'exact-linspace'

import {
	calculateBinCount,
	calculateWidthAuto,
	calculateWidthDoane,
	calculateWidthFd,
	calculateWidthRice,
	calculateWidthScott,
	calculateWidthSqrt,
	calculateWidthSturges,
	calculateNiceRounding,
	roundNumber
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
	const { strategy, column, fixedwidth, fixedcount, nice } = args
	const stats = getStats(input, column, args.min, args.max)
	let [min, max] = stats
	switch (strategy) {
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
		default: {
			let width = estimateWidth(strategy, input.array(column), min, max)

			if (nice) {
				const adjustedValues = calculateNiceRounding(min, max, width)
				const [minValue, maxValue, widthValue] = adjustedValues
				min = minValue
				max = maxValue
				width = widthValue
			}

			const numBins = calculateBinCount(min, max, width)
			
			const binEdges = linspace(min, max, numBins + 1)

			return [min, max, roundNumber(binEdges[1]! - binEdges[0]!)]
		}
	}
}

function estimateWidth(
	strategy: BinStrategy,
	values: number[],
	min: number,
	max: number,
): number {
	switch (strategy) {
		case BinStrategy.Auto:
			return calculateWidthAuto(min, max, values)
		case BinStrategy.Fd:
			return calculateWidthFd(values)
		case BinStrategy.Doane:
			return calculateWidthDoane(min, max, values)
		case BinStrategy.Scott:
			return calculateWidthScott(values)
		case BinStrategy.Rice:
			return calculateWidthRice(min, max, values)
		case BinStrategy.Sturges:
			return calculateWidthSturges(min, max, values)
		case BinStrategy.Sqrt:
			return calculateWidthSqrt(min, max, values)
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
