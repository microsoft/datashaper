/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { FillArgs } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

/**
 * Executes an arquero derive to fill a new column with fixed values.
 * Note this is not the same as imputing, which fills missing values.
 * This is intended to create an entirely new column.
 * TODO: fill with function outputs such as op.row_number or a column copy.
 * This could be merged with derive eventually.
 */
function doFill(input: ColumnTable, { value, to }: FillArgs) {
	const fn = (_d: any, $: any) => $.value
	return input.params({ value }).derive({ [to]: fn })
}

export const fill = makeStepFunction(doFill)
export const fillNode = makeStepNode(doFill)
