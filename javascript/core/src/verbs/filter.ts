/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import type { InputColumnArgs, BooleanOperator } from './types.js'
import { compareAll } from './util/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'
import type { Criterion } from './types.js'

export interface FilterArgs extends InputColumnArgs {
	criteria: Criterion[]
	logical?: BooleanOperator
}

export const filterStep: TableStep<FilterArgs> = (
	input,
	{ column, criteria, logical },
) => input.filter(compareAll(column, criteria, logical))

export const filter = stepNodeFactory(filterStep)
