/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { AggregateStep, TableContainer } from '../../types.js'
import { singleExpression } from '../util/index.js'

/**
 * Executes an aggregate, which is an arquero groupby + rollup.
 * @param step
 * @param store
 * @returns
 */
export async function aggregate(
	{ input, output, args: { groupby, column, operation, to } }: AggregateStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)
	const expr = singleExpression(column, operation)
	const rArgs = { [to]: expr }
	return container(output, inputTable.groupby(groupby).rollup(rArgs))
}
