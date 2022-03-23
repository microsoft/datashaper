/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SampleArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'

export const sample = makeStepNode<SampleArgs>(
	(input, { size, proportion }) => {
		const p = Math.round(input.numRows() * (proportion || 1))
		const s = size || p
		return input.sample(s)
	},
)
