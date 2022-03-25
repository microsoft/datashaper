/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStep } from './nodeFactories/index.js'
import { stepNodeFactory } from './nodeFactories/StepNode.js'

export const unorderStep: TableStep<void> = input => input.unorder()
export const unorder = stepNodeFactory(unorderStep)
