/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	BooleanOperator,
	InputColumnListArgs,
	OutputColumnArgs,
} from './types.js'
import { deriveBoolean } from './util/expressions.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export interface BooleanArgs extends InputColumnListArgs, OutputColumnArgs {
	operator: BooleanOperator
}

export const booleanStep: ColumnTableStep<BooleanArgs> = (
	input,
	{ columns = [], operator, to },
) => input.derive({ [to]: deriveBoolean(columns, operator) })

export const boolean = stepVerbFactory(booleanStep)
