/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { FoldArgs, Step, TableContainer } from '../../types.js'

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
): Promise<TableContainer> {
	const { input, output, args } = step
	const { columns, to } = args as FoldArgs
	const inputTable = await store.table(input)

	return container(output, inputTable.fold(columns, { as: to }))
}
