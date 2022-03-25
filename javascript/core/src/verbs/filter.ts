/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BooleanOperator, Criterion,InputColumnArgs } from './types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { compareAll } from './util/index.js'

export interface FilterArgs extends InputColumnArgs {
	criteria: Criterion[]
	logical?: BooleanOperator
}

export const filterStep: ColumnTableStep<FilterArgs> = (
	input,
	{ column, criteria, logical },
) => input.filter(compareAll(column, criteria, logical))

export const filter = stepVerbFactory(filterStep)
