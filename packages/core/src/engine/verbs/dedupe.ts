/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { DedupeArgs, TableStore } from '../../index.js'
import type { Step } from '../../types.js'

/**
 * Executes an arquero dedupe operation.
 * @param step
 * @param store
 * @returns
 */

export async function dedupe(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { columns } = args as DedupeArgs
	const inputTable = await store.table(input)

	if (columns !== undefined) {
		return inputTable.dedupe(columns)
	}

	return inputTable.dedupe()
}
