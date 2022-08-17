/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const sampleStep: ColumnTableStep<SampleArgs> = (
	input,
	{ size, proportion },
) => {
	const p = Math.round(input.numRows() * (proportion || 1))
	const s = size || p
	return input.sample(s)
}

export const sample = stepVerbFactory(sampleStep)
