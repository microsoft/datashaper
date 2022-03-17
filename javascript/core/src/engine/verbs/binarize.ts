/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { BinarizeStep, TableContainer } from '../../types.js'
import { compareAll } from '../util/index.js'

/**
 * Executes an arquero derive where the output is a 1 or 0.
 */
export async function binarize(
	{ input, output, args: { column, criteria, to } }: BinarizeStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	const expr = compareAll(column, criteria)

	const dArgs = {
		[to]: expr,
	}

	return container(output, inputTable.derive(dArgs))
}
