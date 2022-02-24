/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { DedupeArgs, TableStore } from '../../index.js'
import type { Step, TableContainer } from '../../types.js'

/**
 * Executes an arquero dedupe operation.
 * @param step
 * @param store
 * @returns
 */

export async function dedupe(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { columns } = args as DedupeArgs
	const inputTable = await store.table(input)

	if (columns !== undefined) {
		return container(output, inputTable.dedupe(columns))
	}

	return container(output, inputTable.dedupe())
}
