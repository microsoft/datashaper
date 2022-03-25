/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import { singleExpression } from './util/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'
import type { FieldAggregateOperation } from './types.js'

export interface PivotArgs {
	key: string
	value: string
	operation: FieldAggregateOperation
}

export const pivotStep: TableStep<PivotArgs> = (
	input,
	{ key, value, operation },
) => input.pivot(key, { [value]: singleExpression(value, operation) })

export const pivot = stepNodeFactory(pivotStep)
