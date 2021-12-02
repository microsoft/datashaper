/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { LookupArgs, Step } from '../../types'

/**
 * Executes an arquero lookup.
 * @param step
 * @param store
 * @returns
 */
export async function lookup(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { other, on = [], columns } = args as LookupArgs
	const [inputTable, otherTable] = await Promise.all([
		store.get(input),
		store.get(other),
	])
	// arquero typings are messed up for the lookup join keys
	// eslint-disable-next-line
	return inputTable.lookup(otherTable, on as any, ...columns)
}
