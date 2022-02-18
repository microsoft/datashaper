/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { FillArgs, Step } from '../../types.js'
import type { ExprFunctionMap } from './types.js'

/**
 * Executes an arquero derive to fill a new column with fixed values.
 * Note this is not the same as imputing, which fills missing values.
 * This is intended to create an entirely new column.
 * TODO: fill with function outputs such as op.row_number or a column copy.
 * This could be merged with derive eventually.
 * @param step
 * @param store
 * @returns
 */
export async function fill(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { value, to } = args as FillArgs
	const inputTable = await store.table(input)

	const dArgs: ExprFunctionMap = {
		[to]: (_d: any, $: any) => $.value,
	}

	return inputTable.params({ value }).derive(dArgs)
}
