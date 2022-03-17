/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { DedupeStep, TableContainer } from '../../types.js'

/**
 * Executes an arquero dedupe operation.
 * @param step
 * @param store
 * @returns
 */

export async function dedupe(
	{ input, output, args: { columns } }: DedupeStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	if (columns !== undefined) {
		return container(output, inputTable.dedupe(columns))
	}

	return container(output, inputTable.dedupe())
}
