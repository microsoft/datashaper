/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { container } from '../../container.js'
import type { TableStore } from '../../index.js'
import type { LookupStep, TableContainer } from '../../types.js'

/**
 * Executes an arquero lookup.
 * @param step
 * @param store
 * @returns
 */
export async function lookup(
	{ input, output, args: { other, on = [], columns } }: LookupStep,
	store: TableStore,
): Promise<TableContainer> {
	const [inputTable, otherTable] = await Promise.all([
		store.table(input),
		store.table(other),
	])
	// arquero typings are messed up for the lookup join keys
	// eslint-disable-next-line
	return container(output, inputTable.lookup(otherTable, on as any, ...columns))
}
