/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { compare } from './util/expressions.js'
export const filterStep: ColumnTableStep<FilterArgs> = (
	input,
	{ column, value, operator, strategy },
) => input.filter(compare(column, value, operator, strategy))

export const filter = stepVerbFactory(filterStep)
