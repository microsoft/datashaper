/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { TableStore } from '../../index.js'
import type { FilterArgs, Step } from '../../types.js'
import { compare } from '../util/index.js'

/**
 * Executes an arquero filter.
 * @param step
 * @param store
 * @returns
 */
export async function filter(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { column, value, operator, type } = args as FilterArgs
	const inputTable = await store.get(input)
	const expr = compare(column, value, operator, type)
	return inputTable.filter(expr)
}
