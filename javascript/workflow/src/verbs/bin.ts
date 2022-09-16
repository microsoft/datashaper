/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinArgs } from '@datashaper/schema'
import { BinStrategy } from '@datashaper/schema'
import { fixedBinStep } from '@datashaper/tables'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

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
	const step = computeBins(input, args)
	return fixedBinStep(
		column,
		args.min ?? Number.NEGATIVE_INFINITY,
		args.max ?? Number.POSITIVE_INFINITY,
		step,
		clamped,
		printRange,
	)
}

function computeBins(input: ColumnTable, args: BinArgs) {
	const { strategy, column, fixedwidth, fixedcount } = args
	switch (strategy) {
		case BinStrategy.Auto:
			return input.derive({ bins: op.bins(column) }).get('bins', 0)
		case BinStrategy.FixedWidth:
			if (!fixedwidth) {
				throw new Error('Must supply a bin width')
			}
			return fixedwidth
		case BinStrategy.FixedCount:
			if (!fixedcount) {
				throw new Error('Must supply a bin count')
			}
			return (args.max - args.min) / fixedcount
		default:
			throw new Error(`Unsupported bin strategy ${strategy}`)
	}
}

export const bin = stepVerbFactory(binStep)
