/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WindowArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { singleExpression } from '../util/index.js'

const doWindow = wrapColumnStep<WindowArgs>(
	(input, { column, operation, to }) =>
		input.derive({ [to]: singleExpression(column, operation) }),
)

export const window = makeStepFunction(doWindow)
export const windowNode = makeStepNode(doWindow)
