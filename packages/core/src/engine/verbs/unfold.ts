/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore, UnfoldArgs } from '../../index.js'
import type { Step } from '../../types.js'

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 * @param step
 * @param store
 * @returns
 */
export async function unfold(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { key, value } = args as UnfoldArgs
	let inputTable = await store.table(input)

	inputTable = inputTable
		.groupby(key)
		.rollup({
			[value]: op.array_agg(value),
		})
		.pivot(key, value)

	return inputTable.unroll(inputTable.columnNames())
}
