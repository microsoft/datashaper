/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { PivotArgs, Step } from '../../types.js'
import { singleRollup } from '../util/index.js'

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 * @param step
 * @param store
 * @returns
 */
export async function pivot(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { key, value, operation } = args as PivotArgs
	const inputTable = await store.table(input)

	const expr = singleRollup(value, operation)

	return inputTable.pivot(key, { [value]: expr })
}
