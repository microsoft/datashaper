/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { SpreadArgs, Step } from '../../types.js'

/**
 * Executes an arquero spread operation.
 * @param step
 * @param store
 * @returns
 */
export async function spread(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { to, column } = args as SpreadArgs
	const inputTable = await store.get(input)

	return inputTable.spread(column, { as: to })
}
