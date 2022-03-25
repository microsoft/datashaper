/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export interface SpreadArgs {
	column: string
	to: string[]
}

export const spreadStep: TableStep<SpreadArgs> = (input, { to, column }) =>
	input.spread(column, { as: to })

export const spread = stepNodeFactory(spreadStep)
