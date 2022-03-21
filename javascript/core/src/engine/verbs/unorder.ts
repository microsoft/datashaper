/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doUnorder = wrapColumnStep(input => input.unorder())

export const unorder = makeStepFunction(doUnorder)
export const unorderNode = makeStepNode(doUnorder)
