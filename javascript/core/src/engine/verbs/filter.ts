/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterArgs } from '../../types.js'
import { makeStepNode } from '../factories.js'
import { compareAll } from '../util/index.js'

export const filter = makeStepNode<FilterArgs>(
	(input, { column, criteria, logical }) =>
		input.filter(compareAll(column, criteria, logical)),
)
