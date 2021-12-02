/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { SpreadArgs, Step } from '../../types'

/**
 * Executes an arquero spread operation.
 * @param step
 * @param store
 * @returns
 */
export async function spread(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { columns } = args as SpreadArgs
	const inputTable = await store.get(input)
	return inputTable.spread(columns)
}
