/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnrollArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doUnroll = wrapColumnStep<UnrollArgs>((input, { columns }) =>
	input.unroll(columns),
)

export const unroll = makeStepFunction(doUnroll)
export const unrollNode = makeStepNode(doUnroll)
