/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnTableStep } from './util/factories.js'
import type { InputColumnArgs, OutputColumnArgs } from './types.js'
import { singleExpression } from './util/index.js'
import { stepVerbFactory } from './util/factories.js'
import type { FieldAggregateOperation } from './types.js'

export interface RollupArgs extends InputColumnArgs, OutputColumnArgs {
	/**
	 * Aggregate/rollup operation
	 */
	operation: FieldAggregateOperation
}

export const rollupStep: ColumnTableStep<RollupArgs> = (
	input,
	{ column, operation, to },
) => input.rollup({ [to]: singleExpression(column, operation) })

export const rollup = stepVerbFactory(rollupStep)
