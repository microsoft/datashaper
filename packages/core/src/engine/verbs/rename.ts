/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { RenameArgs, Step } from '../../types.js'

/**
 * Executes an arquero column rename.
 * @param step
 * @param store
 * @returns
 */
export async function rename(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { columns } = args as RenameArgs
	const inputTable = await store.table(input)
	return inputTable.rename(columns)
}
