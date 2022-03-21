/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { singleExpression } from '../util/index.js'

const doRollup = wrapColumnStep<RollupArgs>(
	(input, { column, operation, to }) =>
		input.rollup({ [to]: singleExpression(column, operation) }),
)

export const rollup = makeStepFunction(doRollup)
export const rollupNode = makeStepNode(doRollup)
