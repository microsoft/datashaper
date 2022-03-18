/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { desc } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { OrderbyArgs } from '../../types.js'
import { SortDirection } from '../../types.js'

export const orderby = makeStepFunction(doOrderby)
export const orderbyNode = makeStepNode(doOrderby)

/**
 * Executes an arquero orderby.
 * @param step
 * @param store
 * @returns
 */
function doOrderby(input: ColumnTable, { orders }: OrderbyArgs) {
	// format keys in arquero-compatible format
	// https://uwdata.github.io/arquero/api/verbs#orderby
	const keys = orders.map(({ column, direction }) =>
		direction === SortDirection.Descending ? desc(column) : column,
	)
	return input.orderby(...keys)
}
