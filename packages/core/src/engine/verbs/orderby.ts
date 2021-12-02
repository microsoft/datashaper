/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { desc, internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { OrderbyArgs, SortDirection, Step } from '../../types'

/**
 * Executes an arquero orderby.
 * @param step
 * @param store
 * @returns
 */
export async function orderby(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const inputTable = await store.get(input)

	const { orders } = args as OrderbyArgs
	// format keys in arquero-compatible format
	// https://uwdata.github.io/arquero/api/verbs#orderby
	const keys = orders.map(({ column, direction }) =>
		direction === SortDirection.Descending ? desc(column) : column,
	)
	return inputTable.orderby(...keys)
}
