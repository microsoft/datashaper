/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { RowObject } from 'arquero/dist/types/table/table'
import { TableStore } from '../..'
import { FillArgs, Step } from '../../types'
import { from } from 'arquero'

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
	const { value, to } = args as FillArgs
	const inputTable = await store.get(input)

	let matrix: RowObject[] = inputTable.objects()

	matrix.forEach(row => {
		if (row[to] === value) {
			row[to] = undefined
		}
	})

	return from(matrix)
}
