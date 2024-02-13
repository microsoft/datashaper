/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleArgs } from '@datashaper/schema'
import aq, { seed, op } from 'arquero'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

const UNSAMPLED_TABLE = "unsampled"

export const sampleStep: ColumnTableStep<SampleArgs> = (
	input,
	{ size, proportion, seed: seedArg, emitUnsampled },
	{ emit }
) => {
	const executeSampling = () => {
		const p = Math.round(input.numRows() * (proportion || 1))
		const s = size || p

		// Handle the simple case where we don't have to track what was not sampled
		if (!emitUnsampled) {
			return input.sample(s)
		} 

		// Attach a temporary row number
		const inputWithIndex = input.derive({ __temp_index: op.row_number() })

		// Perform the sampling
		const sampled = inputWithIndex.sample(s)

		// Track what was sampled
		const sampledIndices = new Set<number>()
		const numRows = inputWithIndex.numRows()
		const indexColumn = sampled.getter("__temp_index")
		for (let i = 0; i < numRows; i++) {
			const value = indexColumn(i)
			if (value != null) {
				sampledIndices.add(value)
			}
		}
		
		// Figure out what was unsampled
		const unsampledRows: Record<string, any>[] = []
		const inputRows = inputWithIndex.objects() as any[]
		for (const {__temp_index, ...row} of inputRows) {
			if (!sampledIndices.has(__temp_index)) {
				unsampledRows.push(row)
			}
		}

		const unsampled = aq.from(unsampledRows)
		emit(unsampled, UNSAMPLED_TABLE)

		// Return the sampled data without the temporary index
		return sampled.select(sampled.columnNames((name)=> name !== "__temp_index"))
	}


	try {
		if (seedArg != null) seed(seedArg)
		return executeSampling()
	} finally {
		// reset the seed
		if (seedArg != null) seed(null as any)
	}
}

export const sample = stepVerbFactory(sampleStep, [], [UNSAMPLED_TABLE])
