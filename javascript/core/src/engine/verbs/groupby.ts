/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { GroupbyStep, TableContainer } from '../../types.js'

/**
 * Executes an arquero groupby operation.
 * @param step
 * @param store
 * @returns
 */
export async function groupby(
	{ input, output, args: { columns } }: GroupbyStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)
	return container(output, inputTable.groupby(columns))
}
