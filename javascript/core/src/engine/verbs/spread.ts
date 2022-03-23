/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SpreadArgs } from '../../types.js'
import { makeStepNode } from '../factories.js'

export const spread = makeStepNode<SpreadArgs>((input, { to, column }) =>
	input.spread(column, { as: to }),
)
