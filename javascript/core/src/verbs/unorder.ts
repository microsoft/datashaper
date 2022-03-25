/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnTableStep } from './util/factories.js'
import { stepNodeFactory } from './util/factories.js'

export const unorderStep: ColumnTableStep<void> = input => input.unorder()
export const unorder = stepNodeFactory(unorderStep)
