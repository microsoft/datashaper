/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { compareAll } from './util/index.js'

export const filterStep: ColumnTableStep<FilterArgs> = (
	input,
	{ column, criteria, logical },
) => input.filter(compareAll(column, criteria, logical))

export const filter = stepVerbFactory(filterStep)
