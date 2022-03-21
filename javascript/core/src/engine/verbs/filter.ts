/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import type { FilterArgs , TableContainer } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'
import { compareAll } from '../util/index.js'

export const filter = makeStepFunction(doFilter)
export const filterNode = makeStepNode(doFilter)

function doFilter(
	id: string,
	input: TableContainer,
	{ column, criteria }: FilterArgs,
) {
	let result: ColumnTable | undefined
	if (input.table != null) {
		const expr = compareAll(column, criteria)
		result = input.table.filter(expr)
	}
	return container(id, result)
}
