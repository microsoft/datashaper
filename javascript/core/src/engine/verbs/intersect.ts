/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '../../index.js'
import type { Step, TableContainer } from '../../types.js'
import { SetOp } from '../../types.js'
import { set } from '../util/index.js'

/**
 * Executes an arquero table intersect.
 * @param step
 * @param store
 * @returns
 */
export async function intersect(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	return set(step, store, SetOp.Intersect)
}
