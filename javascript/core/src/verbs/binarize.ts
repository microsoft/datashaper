/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BinarizeArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'
import { compareAll } from './util/index.js'

/**
 * Executes an arquero derive where the output is a 1 or 0.
 */
export const binarize = makeStepNode<BinarizeArgs>(
	(input, { to, column, criteria, logical }) =>
		input.derive({ [to]: compareAll(column, criteria, logical) }),
)
