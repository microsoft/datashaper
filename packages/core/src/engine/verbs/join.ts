/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { JoinArgs, Step } from '../../types.js'

/**
 * Executes an arquero join.
 * @param step
 * @param store
 * @returns
 */
export async function join(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { other, on } = args as JoinArgs
	const [inputTable, otherTable] = await Promise.all([
		store.table(input),
		store.table(other),
	])
	return inputTable.join(otherTable, on)
}
