/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { from } from 'arquero'
import type { RowObject } from 'arquero/dist/types/table/table'
import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { EraseArgs, Step, TableContainer } from '../../types.js'

/**
 * Executes an arquero erase operation.
 * @param step
 * @param store
 * @returns
 */

export async function erase(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { value, column } = args as EraseArgs
	const inputTable = await store.table(input)

	const matrix: RowObject[] = inputTable.objects()

	matrix.forEach(row => {
		if (row[column] === value) {
			row[column] = undefined
		}
	})

	return container(output, from(matrix))
}
