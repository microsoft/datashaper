/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { ImputeArgs, Step, TableContainer } from '../../types.js'
import type { ExprFunctionMap } from './types.js'

/**
 * Executes an arquero impute
 * @param step
 * @param store
 * @returns
 */
export async function impute(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { value, column } = args as ImputeArgs
	const inputTable = await store.table(input)

	const dArgs: ExprFunctionMap = {
		[column]: (_d: any, $: any) => $.value,
	}

	return container(output, inputTable.params({ value }).impute(dArgs))
}
