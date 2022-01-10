/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../..'
import { Step } from '../../types'

/**
 * Executes an arquero orderby.
 * @param step
 * @param store
 * @returns
 */
//TODO These do not take any args
export async function unorder(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input } = step
	const inputTable = await store.get(input)

	return inputTable.unorder()
}
