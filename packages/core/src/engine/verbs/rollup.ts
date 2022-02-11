/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../../index.js'
import { Step, RollupArgs } from '../../types.js'
import { singleRollup } from '../util'

/**
 * Executes rollup.
 * @param step
 * @param store
 * @returns
 */

export async function rollup(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { column, operation, to } = args as RollupArgs
	const inputTable = await store.get(input)

	const expr = singleRollup(column, operation)

	const rArgs = {
		[to]: expr,
	}

	return inputTable.rollup(rArgs)
}
