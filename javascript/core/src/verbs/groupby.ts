/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GroupbyArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'

export const groupby = makeStepNode<GroupbyArgs>((input, { columns }) =>
	input.groupby(columns),
)
