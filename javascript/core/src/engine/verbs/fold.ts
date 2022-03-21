/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import type { FoldArgs,TableContainer  } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const fold = makeStepFunction(doFold)
export const foldNode = makeStepNode(doFold)

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 */
function doFold(id: string, input: TableContainer, { columns, to }: FoldArgs) {
	let result: ColumnTable | undefined
	if (input.table != null) {
		result = input.table.fold(columns, { as: to })
	}
	return container(id, result)
}
