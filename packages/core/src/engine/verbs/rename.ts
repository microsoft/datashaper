/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { RenameArgs, Step } from '../../types'

/**
 * Executes an arquero column rename.
 * @param step
 * @param store
 * @returns
 */
export async function rename(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { columns } = args as RenameArgs
	const inputTable = await store.get(input)
	return inputTable.rename(columns)
}
