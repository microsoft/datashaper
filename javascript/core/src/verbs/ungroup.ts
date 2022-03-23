/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { makeStepNode } from './util/factories.js'

export const ungroup = makeStepNode(input => input.ungroup())
