/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape, op } from 'arquero'
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { RecodeStep, TableContainer } from '../../types.js'

/**
 * Executes an arquero derive to map a list of values to new values.
 * Commonly used for recategorization.
 * @param step
 * @param store
 * @returns
 */
export async function recode(
	{ input, output, args: { column, to, map } }: RecodeStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	const dArgs: ExprObject = {
		[to]: escape((d: any) => op.recode(d[column], map)),
	}

	return container(output, inputTable.derive(dArgs))
}
