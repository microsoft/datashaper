/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { internal as ArqueroTypes } from 'arquero'
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
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { groupby, field, operation, as } = args as AggregateArgs
	const inputTable = await store.get(input)

	const expr = singleRollup(field, operation)

	const rArgs = {
		[`${as}`]: expr,
	}

	return inputTable.groupby(groupby).rollup(rArgs)
}
