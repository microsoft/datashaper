/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../../index.js'
import { SetOp, Step } from '../../types.js'
import { set } from '../util/index.js'

/**
 * Executes an arquero table difference.
 * @param step
 * @param store
 * @returns
 */
export async function difference(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	return set(step, store, SetOp.Difference)
}
