/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { AggregateArgs, Step } from '../../types.js'
import { singleRollup } from '../util/index.js'

/**
 * Executes an aggregate, which is an arquero groupby + rollup.
 * @param step
 * @param store
 * @returns
 */
export async function aggregate(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { groupby, column, operation, to } = args as AggregateArgs
	const inputTable = await store.table(input)

	const expr = singleRollup(column, operation)

	const rArgs = {
		[to]: expr,
	}

	return inputTable.groupby(groupby).rollup(rArgs)
}
