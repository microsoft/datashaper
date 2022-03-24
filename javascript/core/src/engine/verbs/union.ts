/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '../../index.js'
import type { SetOperationArgs,Step, TableContainer } from '../../types.js'
import { SetOp } from '../../types.js'
import { SetOperationNode } from '../factories.js'
import { setWithStore } from '../util/index.js'

export async function union(
	step: Step<SetOperationArgs>,
	store: TableStore,
): Promise<TableContainer> {
	return setWithStore(step, store, SetOp.Union)
}

export function unionNode(id: string): SetOperationNode {
	return new SetOperationNode(id, SetOp.Union)
}
