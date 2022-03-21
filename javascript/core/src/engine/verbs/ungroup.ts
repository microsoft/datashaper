/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doUngroup = wrapColumnStep(input => input.ungroup())

export const ungroup = makeStepFunction(doUngroup)
export const ungroupNode = makeStepNode(doUngroup)
