/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../../index.js'
import { JoinArgs, Step } from '../../types.js'

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
		store.get(input),
		store.get(other),
	])
	return inputTable.join(otherTable, on)
}
