/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '../../types.js'
import { makeStepNode } from '../factories.js'
import { singleExpression } from '../util/index.js'

export const window = makeStepNode<WindowArgs>(
	(input, { column, operation, to }) =>
		input.derive({ [to]: singleExpression(column, operation) }),
)
