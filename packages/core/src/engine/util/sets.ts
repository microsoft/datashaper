/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../../TableStore'
import { SetOp, SetOperationArgs, Step } from '../../types'

/**
 * All of the arquero set verbs use the same args.
 * This util just simplifies executing them.
 * @param step
 * @param store
 * @param op
 * @returns
 */
export async function set(
	step: Step,
	store: TableStore,
	op: SetOp,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { others } = args as SetOperationArgs
	const [inputTable, ...otherTables] = await Promise.all([
		store.get(input),
		...others.map(other => store.get(other)),
	])
	return inputTable[op](...otherTables)
}
