/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnTableStep } from './util/factories.js'
import { singleExpression } from './util/index.js'
import { stepVerbFactory } from './util/factories.js'
import type { FieldAggregateOperation } from './types.js'

export interface PivotArgs {
	key: string
	value: string
	operation: FieldAggregateOperation
}

export const pivotStep: ColumnTableStep<PivotArgs> = (
	input,
	{ key, value, operation },
) => input.pivot(key, { [value]: singleExpression(value, operation) })

export const pivot = stepVerbFactory(pivotStep)
