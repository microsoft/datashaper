/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../TableStore.js'
import { SetOp, SetOperationArgs, Step } from '../../types.js'

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
): Promise<ColumnTable> {
	const { input, args } = step
	const { others } = args as SetOperationArgs
	const [inputTable, ...otherTables] = await Promise.all([
		store.get(input),
		...others.map(other => store.get(other)),
	])
	// arquero uses 'except' for the difference set operation, we need to map it
	const fn = op === SetOp.Difference ? 'except' : op
	return inputTable[fn](...otherTables)
}
