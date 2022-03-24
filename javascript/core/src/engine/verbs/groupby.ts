/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { GroupbyArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doGroupby = wrapColumnStep<GroupbyArgs>((input, { columns }) =>
	input.groupby(columns),
)

export const groupby = makeStepFunction(doGroupby)
export const groupbyNode = makeStepNode(doGroupby)
