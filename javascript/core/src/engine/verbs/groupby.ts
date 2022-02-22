/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { GroupbyArgs, Step, TableContainer } from '../../types.js'

/**
 * Executes an arquero groupby operation.
 * @param step
 * @param store
 * @returns
 */
export async function groupby(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { columns } = args as GroupbyArgs
	const inputTable = await store.table(input)
	return container(output, inputTable.groupby(columns))
}
