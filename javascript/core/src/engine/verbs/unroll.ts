/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { Step, TableContainer, UnrollArgs } from '../../types.js'

/**
 * Executes an arquero unroll operation.
 * @param step
 * @param store
 * @returns
 */
export async function unroll(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { columns } = args as UnrollArgs
	const inputTable = await store.table(input)

	return container(output, inputTable.unroll(columns))
}
