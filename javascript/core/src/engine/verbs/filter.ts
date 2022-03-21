/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'
import { compareAll } from '../util/index.js'

const doFilter = wrapColumnStep<FilterArgs>((input, { column, criteria }) => {
	const expr = compareAll(column, criteria)
	return input.filter(expr)
})

export const filter = makeStepFunction(doFilter)
export const filterNode = makeStepNode(doFilter)
