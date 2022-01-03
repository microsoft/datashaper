/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../..'
import { GroupbyArgs, Step } from '../../types'

/**
 * Executes an arquero dedupe operation.
 * @param step
 * @param store
 * @returns
 */

//TODO optional input column list like GROUPBY
export async function dedupe(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { columns } = args as GroupbyArgs
	const inputTable = await store.get(input)
	return inputTable.groupby(columns)
}
