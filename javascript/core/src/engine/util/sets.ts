/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { container } from '../../factories.js'
import type {
	TableContainer,
	TableStore,
	SetOperationArgs,
	Step,
} from '../../types.js'
import { SetOp } from '../../types.js'

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
): Promise<TableContainer> {
	const { input, output, args } = step
	const { others } = args as SetOperationArgs
	const [inputTable, ...otherTables] = await Promise.all([
		store.table(input),
		...others.map(other => store.table(other)),
	])
	// arquero uses 'except' for the difference set operation, we need to map it
	const fn = op === SetOp.Difference ? 'except' : op
	return container(output, inputTable[fn](...otherTables))
}
