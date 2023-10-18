/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleArgs } from '@datashaper/schema'
import { seed } from 'arquero'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const sampleStep: ColumnTableStep<SampleArgs> = (
	input,
	{ size, proportion, seed: seedArg },
) => {
	const p = Math.round(input.numRows() * (proportion || 1))
	const s = size || p

	if (seedArg != null) seed(seedArg)
	const result = input.sample(s)
	// reset the seed
	if (seedArg != null) seed(null as any)

	return result
}

export const sample = stepVerbFactory(sampleStep)
