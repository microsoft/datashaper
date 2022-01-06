/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../..'
import { SetOp, Step } from '../../types'
import { set } from '../util'

/**
 * Executes an arquero table except.
 * @param step
 * @param store
 * @returns
 */
export async function except(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	return set(step, store, SetOp.Except)
}
