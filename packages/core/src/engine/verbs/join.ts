/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { JoinArgs, Step } from '../../types'

/**
 * Executes an arquero join.
 * @param step
 * @param store
 * @returns
 */
export async function join(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { other, on } = args as JoinArgs
	const [inputTable, otherTable] = await Promise.all([
		store.get(input),
		store.get(other),
	])
	return inputTable.join(otherTable, on)
}
