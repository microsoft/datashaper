/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const ungroupStep: ColumnTableStep<void> = (input) => input.ungroup()
export const ungroup = stepVerbFactory(ungroupStep)
