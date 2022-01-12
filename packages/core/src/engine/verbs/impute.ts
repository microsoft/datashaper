/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../..'
import { FillArgs, Step } from '../../types'
import { ExprFunctionMap } from './types'

/**
 * Executes an arquero impute
 * @param step
 * @param store
 * @returns
 */
export async function impute(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { value, to } = args as FillArgs
	const inputTable = await store.get(input)

	const dArgs: ExprFunctionMap = {
		[to]: (d: any, $: any) => $.value,
	}

	return inputTable.params({ value }).impute(dArgs)
}
