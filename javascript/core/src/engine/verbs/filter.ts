/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { compareAll } from '../util/index.js'

const doFilter = wrapColumnStep<FilterArgs>(
	(input, { column, criteria, logical }) =>
		input.filter(compareAll(column, criteria, logical)),
)

export const filter = makeStepFunction(doFilter)
export const filterNode = makeStepNode(doFilter)
