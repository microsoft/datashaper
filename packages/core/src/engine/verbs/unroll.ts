/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { Step, UnrollArgs } from '../../types.js'

/**
 * Executes an arquero unroll operation.
 * @param step
 * @param store
 * @returns
 */
export async function unroll(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { columns } = args as UnrollArgs
	const inputTable = await store.get(input)
	return inputTable.unroll(columns)
}
