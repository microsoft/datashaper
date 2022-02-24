/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { Step, TableContainer } from '../../types.js'

/**
 * Executes an arquero ungroup operation.
 * @param step
 * @param store
 * @returns
 */

export async function ungroup(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output } = step
	const inputTable = await store.table(input)
	return container(output, inputTable.ungroup())
}
