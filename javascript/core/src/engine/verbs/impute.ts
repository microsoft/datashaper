/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { ImputeArgs } from '../../types.js'
import type { ExprFunctionMap } from './types.js'

export const impute = makeStepFunction(doImpute)
export const imputeNode = makeStepNode(doImpute)

/**
 * Executes an arquero impute
 * @param step
 * @param store
 * @returns
 */
function doImpute(input: ColumnTable, { value, column }: ImputeArgs) {
	const dArgs: ExprFunctionMap = {
		[column]: (_d: any, $: any) => $.value,
	}
	return input.params({ value }).impute(dArgs)
}
