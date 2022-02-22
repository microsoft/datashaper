/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { SpreadArgs, Step, TableContainer } from '../../types.js'

/**
 * Executes an arquero spread operation.
 * @param step
 * @param store
 * @returns
 */
export async function spread(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { to, column } = args as SpreadArgs
	const inputTable = await store.table(input)

	return container(output, inputTable.spread(column, { as: to }))
}
