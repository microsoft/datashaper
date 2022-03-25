/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnListArgs } from './types.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export type UnrollArgs = InputColumnListArgs

export const unrollStep: TableStep<UnrollArgs> = (input, { columns }) =>
	input.unroll(columns)

export const unroll = stepNodeFactory(unrollStep)
