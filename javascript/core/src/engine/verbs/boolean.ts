/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import { container } from '../../container.js'
import type { TableStore } from '../../index.js'
import type { BooleanStep, TableContainer } from '../../types.js'
import { deriveBoolean } from '../util/expressions.js'

/**
 * Executes an boolean operation across columns.
 * @param step
 * @param store
 * @returns
 */

export async function boolean(
	{ input, output, args: { columns = [], operator, to } }: BooleanStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	const func = deriveBoolean(columns, operator)

	const dArgs: ExprObject = { [to]: func }
	return container(output, inputTable.derive(dArgs))
}
