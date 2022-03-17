/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { TableContainer,UnrollStep } from '../../types.js'

/**
 * Executes an arquero unroll operation.
 * @param step
 * @param store
 * @returns
 */
export async function unroll(
	{ input, output, args: { columns } }: UnrollStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	return container(output, inputTable.unroll(columns))
}
