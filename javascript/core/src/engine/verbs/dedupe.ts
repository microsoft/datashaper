/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DedupeArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

/**
 * Executes an arquero dedupe operation.
 */
const doDedupe = wrapColumnStep<DedupeArgs>((input, { columns }) =>
	columns ? input.dedupe(columns) : input.dedupe(),
)

export const dedupe = makeStepFunction(doDedupe)
export const dedupeNode = makeStepNode(doDedupe)
