/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../../index.js'
import { FoldArgs, Step } from '../../types.js'

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 * @param step
 * @param store
 * @returns
 */
export async function fold(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { columns, to } = args as FoldArgs
	const inputTable = await store.get(input)
	return inputTable.fold(columns, { as: to })
}
