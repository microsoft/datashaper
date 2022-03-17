/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { TableContainer,WindowStep } from '../../types.js'
import { singleExpression } from '../util/index.js'

/**
 * Executes rollup.
 * @param step
 * @param store
 * @returns
 */

export async function window(
	{ input, output, args: { column, operation, to } }: WindowStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	const expr = singleExpression(column, operation)

	const dArgs = {
		[to]: expr,
	}

	return container(output, inputTable.derive(dArgs))
}
