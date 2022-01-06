/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../..'
import { AggregateArgs, Step } from '../../types'
import { singleRollup } from '../util'

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
	const { groupby, field, operation, as } = args as AggregateArgs
	const inputTable = await store.get(input)

	const expr = singleRollup(field, operation)

	const rArgs = {
		[`${as}`]: expr,
	}

	return inputTable.groupby(groupby).rollup(rArgs)
}
