/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { from } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { RowObject } from 'arquero/dist/types/table/table'
import { TableStore } from '../../index.js'
import { EraseArgs, Step } from '../../types.js'

/**
 * Executes an arquero erase operation.
 * @param step
 * @param store
 * @returns
 */

export async function erase(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { value, column } = args as EraseArgs
	const inputTable = await store.get(input)

	const matrix: RowObject[] = inputTable.objects()

	matrix.forEach(row => {
		if (row[column] === value) {
			row[column] = undefined
		}
	})

	return from(matrix)
}
