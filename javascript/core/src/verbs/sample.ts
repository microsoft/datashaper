/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export interface SampleArgs {
	/**
	 * Number of rows to sample from the table.
	 * This takes precedence over proportion.
	 */
	size?: number
	/**
	 * If table size is unknown ahead of time, specify a proportion of rows to sample.
	 * If size is specified, it will be used instead, otherwise computed from this
	 * proportion using the table.numRows()
	 */
	proportion?: number
}

export const sampleStep: TableStep<SampleArgs> = (
	input,
	{ size, proportion },
) => {
	const p = Math.round(input.numRows() * (proportion || 1))
	const s = size || p
	return input.sample(s)
}

export const sample = stepNodeFactory(sampleStep)
