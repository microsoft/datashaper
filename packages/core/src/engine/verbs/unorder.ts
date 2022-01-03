/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { desc } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../..'
import { OrderbyArgs, SortDirection, Step } from '../../types'

/**
 * Executes an arquero orderby.
 * @param step
 * @param store
 * @returns
 */
//TODO These do not take any args 
export async function unorder(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const inputTable = await store.get(input)

	const { orders } = args as OrderbyArgs
	const keys = orders.map(({ column, direction }) =>
		direction === SortDirection.Descending ? desc(column) : column,
	)
	return inputTable.orderby(...keys)
}
