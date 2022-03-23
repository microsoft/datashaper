/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PivotArgs } from '../../types.js'
import { makeStepNode } from '../factories.js'
import { singleExpression } from '../util/index.js'

export const pivot = makeStepNode<PivotArgs>(
	(input, { key, value, operation }) =>
		input.pivot(key, { [value]: singleExpression(value, operation) }),
)
