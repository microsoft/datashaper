/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { LookupArgs, Step } from '../../types.js'

/**
 * Executes an arquero lookup.
 * @param step
 * @param store
 * @returns
 */
export async function lookup(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { other, on = [], columns } = args as LookupArgs
	const [inputTable, otherTable] = await Promise.all([
		store.get(input),
		store.get(other),
	])
	// arquero typings are messed up for the lookup join keys
	// eslint-disable-next-line
	return inputTable.lookup(otherTable, on as any, ...columns)
}
