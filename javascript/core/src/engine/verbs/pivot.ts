/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { singleExpression } from '../util/index.js'

const doPivot = wrapColumnStep<PivotArgs>((input, { key, value, operation }) =>
	input.pivot(key, { [value]: singleExpression(value, operation) }),
)

export const pivot = makeStepFunction(doPivot)
export const pivotNode = makeStepNode(doPivot)
