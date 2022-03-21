/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doSpread = wrapColumnStep<SpreadArgs>((input, { to, column }) =>
	input.spread(column, { as: to }),
)

export const spread = makeStepFunction(doSpread)
export const spreadNode = makeStepNode(doSpread)
