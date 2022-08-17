/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FoldArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const foldStep: ColumnTableStep<FoldArgs> = (input, { columns, to }) =>
	input.fold(columns, { as: to })

export const fold = stepVerbFactory(foldStep)
