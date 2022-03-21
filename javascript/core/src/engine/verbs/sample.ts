/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doSample = wrapColumnStep<SampleArgs>((input, { size, proportion }) => {
	const p = Math.round(input.numRows() * (proportion || 1))
	const s = size || p
	return input.sample(s)
})

export const sample = makeStepFunction(doSample)
export const sampleNode = makeStepNode(doSample)
