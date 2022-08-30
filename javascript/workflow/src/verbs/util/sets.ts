/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SetOp } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function set(
	input: ColumnTable,
	op: SetOp,
	others: ColumnTable[],
): ColumnTable {
	// arquero uses 'except' for the difference set operation, we need to map it
	const fn = op === SetOp.Difference ? 'except' : op
	return input[fn](...others)
}
