/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { Step, RollupArgs, TableContainer } from '../../types.js'
import { singleRollup } from '../util/index.js'

/**
 * Executes rollup.
 * @param step
 * @param store
 * @returns
 */

export async function rollup(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { column, operation, to } = args as RollupArgs
	const inputTable = await store.table(input)

	const expr = singleRollup(column, operation)

	const rArgs = {
		[to]: expr,
	}

	return container(output, inputTable.rollup(rArgs))
}
