/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DedupeArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'

/**
 * Executes an arquero dedupe operation.
 */
export const dedupe = makeStepNode<DedupeArgs>((input, { columns }) =>
	columns ? input.dedupe(columns) : input.dedupe(),
)
