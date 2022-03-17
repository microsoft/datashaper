/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { PivotStep, TableContainer } from '../../types.js'
import { singleExpression } from '../util/index.js'

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 * @param step
 * @param store
 * @returns
 */
export async function pivot(
	{ input, output, args: { key, value, operation } }: PivotStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	const expr = singleExpression(value, operation)

	return container(output, inputTable.pivot(key, { [value]: expr }))
}
