/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { Step } from '../../types.js'

/**
 * Executes an arquero ungroup operation.
 * @param step
 * @param store
 * @returns
 */

export async function ungroup(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input } = step
	const inputTable = await store.get(input)

	return inputTable.ungroup()
}
