/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'
import type { InputColumnArgs, OutputColumnArgs , WindowFunction } from './types.js'
import { singleExpression } from './util/index.js'

export interface WindowArgs extends InputColumnArgs, OutputColumnArgs {
	operation: WindowFunction
}

export const windowStep: TableStep<WindowArgs> = (
	input,
	{ column, operation, to },
) => input.derive({ [to]: singleExpression(column, operation) })

export const window = stepNodeFactory(windowStep)
