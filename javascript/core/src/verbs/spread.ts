/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export interface SpreadArgs {
	column: string
	to: string[]
}

export const spreadStep: ColumnTableStep<SpreadArgs> = (
	input,
	{ to, column },
) => input.spread(column, { as: to })

export const spread = stepVerbFactory(spreadStep)
