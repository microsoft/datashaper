/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { FilterArgs } from '../../types.js'
import { compareAll } from '../util/index.js'

export const filter = makeStepFunction(doFilter)
export const filterNode = makeStepNode(doFilter)

/**
 * Executes an arquero filter.
 * @param step
 * @param store
 * @returns
 */
function doFilter(input: ColumnTable, { column, criteria }: FilterArgs) {
	const expr = compareAll(column, criteria)
	return input.filter(expr)
}
