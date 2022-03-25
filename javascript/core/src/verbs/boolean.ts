/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnListArgs, OutputColumnArgs } from './types.js'
import type { BooleanOperator } from './types.js'

import { deriveBoolean } from './util/expressions.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export interface BooleanArgs extends InputColumnListArgs, OutputColumnArgs {
	operator: BooleanOperator
}

export const booleanStep: TableStep<BooleanArgs> = (
	input,
	{ columns = [], operator, to },
) => input.derive({ [to]: deriveBoolean(columns, operator) })

export const boolean = stepNodeFactory(booleanStep)
