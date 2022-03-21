/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { compareAll } from '../util/index.js'

/**
 * Executes an arquero derive where the output is a 1 or 0.
 */
const doBinarize = wrapColumnStep<BinarizeArgs>(
	(input, { to, column, criteria }) =>
		input.derive({ [to]: compareAll(column, criteria) }),
)

export const binarize = makeStepFunction(doBinarize)
export const binarizeNode = makeStepNode(doBinarize)
