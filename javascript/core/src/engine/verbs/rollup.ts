/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RollupArgs } from '../../types.js'
import { makeStepNode } from '../factories.js'
import { singleExpression } from '../util/index.js'

export const rollup = makeStepNode<RollupArgs>(
	(input, { column, operation, to }) =>
		input.rollup({ [to]: singleExpression(column, operation) }),
)
