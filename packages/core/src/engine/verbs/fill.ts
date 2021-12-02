/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { FillArgs, Step } from '../../types'
import { ExprFunctionMap } from './types'

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
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { value, as } = args as FillArgs
	const inputTable = await store.get(input)

	const dArgs: ExprFunctionMap = {}
	dArgs[as] = (d: any, $: any) => $.value

	return inputTable.params({ value }).derive(dArgs)
}
