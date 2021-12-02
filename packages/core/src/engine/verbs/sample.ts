/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { internal as ArqueroTypes } from 'arquero'
import { TableStore } from '../..'
import { SampleArgs, Step } from '../../types'

/**
 * Executes an arquero sample to extract random rows.
 * percent options allows for dynamic size compute
 * @param step
 * @param store
 * @returns
 */
export async function sample(
	step: Step,
	store: TableStore,
): Promise<ArqueroTypes.ColumnTable> {
	const { input, args } = step
	const { size, proportion } = args as SampleArgs
	const inputTable = await store.get(input)
	const p = Math.round(inputTable.numRows() * (proportion || 1))
	const s = size || p
	return inputTable.sample(s)
}
