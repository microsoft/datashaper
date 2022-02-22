/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { SampleArgs, Step, TableContainer } from '../../types.js'

/**
 * Executes an arquero sample to extract random rows.
 * percent options allows for dynamic size compute
 * @param step
 * @param store
 * @returns
 */
export async function sample(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { size, proportion } = args as SampleArgs
	const inputTable = await store.table(input)
	const p = Math.round(inputTable.numRows() * (proportion || 1))
	const s = size || p
	return container(output, inputTable.sample(s))
}
