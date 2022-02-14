/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ColumnTable from 'arquero/dist/types/table/column-table'
import { TableStore } from '../../index.js'
import { BinarizeArgs, Step } from '../../types.js'
import { compare } from '../util/index.js'

/**
 * Executes an arquero derive where the output is a 1 or 0.
 */
export async function binarize(
	step: Step,
	store: TableStore,
): Promise<ColumnTable> {
	const { input, args } = step
	const { column, value, operator, type, to } = args as BinarizeArgs
	const inputTable = await store.get(input)

	const expr = compare(column, value, operator, type)

	const dArgs = {
		[to]: expr,
	}

	return inputTable.derive(dArgs)
}
