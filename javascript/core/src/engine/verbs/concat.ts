/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '../../index.js'
import { SetOp, Step, TableContainer } from '../../types.js'
import { set } from '../util/index.js'

/**
 * Executes an arquero table concat.
 * @param step
 * @param store
 * @returns
 */
export async function concat(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	return set(step, store, SetOp.Concat)
}
