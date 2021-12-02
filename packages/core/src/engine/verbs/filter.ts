/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { FilterArgs, Step } from '../../types'
import { compare } from '../util'

/**
 * Executes an arquero filter.
 * @param step
 * @param store
 * @returns
 */
export async function filter(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { column, value, operator, type } = args as FilterArgs
	const inputTable = await store.get(input)
	const expr = compare(column, value, operator, type)
	return inputTable.filter(expr)
}
