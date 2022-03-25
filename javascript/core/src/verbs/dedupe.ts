/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnListArgs } from './types.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export type DedupeArgs = Partial<InputColumnListArgs>

export const dedupeStep: TableStep<DedupeArgs> = (input, { columns }) =>
	columns ? input.dedupe(columns) : input.dedupe()
export const dedupe = stepNodeFactory(dedupeStep)
