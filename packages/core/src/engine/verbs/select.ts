/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { all, not as arqueroNot, internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { SelectArgs, Step } from '../../types'

/**
 * Executes an arquero select.
 * @param step
 * @param store
 * @returns
 */
export async function select(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { columns = {}, not } = args as SelectArgs
	const inputTable = await store.get(input)
	const expr = Object.keys(columns) as any
	if (not) {
		expr.push(arqueroNot(not))
	}
	if (expr.length === 0) {
		expr.push(all())
	}
	return inputTable.select(...expr)
}
