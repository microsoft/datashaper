/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FilterArgs } from '../filter.js'
import { BooleanOperator } from '../types.js'

export const filter = (): Omit<FilterArgs, 'column'> => ({
	criteria: [],
	logical: BooleanOperator.OR,
})
