/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import type { FillArgs, TableContainer } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const fill = makeStepFunction(doFill)
export const fillNode = makeStepNode(doFill)

/**
 * Executes an arquero derive to fill a new column with fixed values.
 * Note this is not the same as imputing, which fills missing values.
 * This is intended to create an entirely new column.
 * TODO: fill with function outputs such as op.row_number or a column copy.
 * This could be merged with derive eventually.
 */
function doFill(id: string, input: TableContainer, { value, to }: FillArgs) {
	let result: ColumnTable | undefined

	if (input.table != null) {
		const fn = (_d: any, $: any) => $.value
		result = input.table.params({ value }).derive({ [to]: fn })
	}

	return container(id, result)
}
