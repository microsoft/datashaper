/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnrollArgs } from '../../types.js'
import { makeStepNode } from '../factories.js'

export const unroll = makeStepNode<UnrollArgs>((input, { columns }) =>
	input.unroll(columns),
)
