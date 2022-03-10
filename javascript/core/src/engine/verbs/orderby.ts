/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { desc } from 'arquero'

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { OrderbyArgs, Step, TableContainer } from '../../types.js'
import { SortDirection } from '../../types.js'

/**
 * Executes an arquero orderby.
 * @param step
 * @param store
 * @returns
 */
export async function orderby(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const inputTable = await store.table(input)

	const { orders } = args as OrderbyArgs
	// format keys in arquero-compatible format
	// https://uwdata.github.io/arquero/api/verbs#orderby
	const keys = orders.map(({ column, direction }) =>
		direction === SortDirection.Descending ? desc(column) : column,
	)
	return container(output, inputTable.orderby(...keys))
}
