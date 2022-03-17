/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { SpreadStep, TableContainer } from '../../types.js'

/**
 * Executes an arquero spread operation.
 * @param step
 * @param store
 * @returns
 */
export async function spread(
	{ input, output, args: { to, column } }: SpreadStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	return container(output, inputTable.spread(column, { as: to }))
}
