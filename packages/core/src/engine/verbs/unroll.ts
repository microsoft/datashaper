/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { Step, UnrollArgs } from '../../types'

/**
 * Executes an arquero unroll operation.
 * @param step
 * @param store
 * @returns
 */
export async function unroll(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { columns } = args as UnrollArgs
	const inputTable = await store.get(input)
	return inputTable.unroll(columns)
}
