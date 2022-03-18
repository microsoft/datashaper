/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { PivotArgs } from '../../types.js'
import { singleExpression } from '../util/index.js'

export const pivot = makeStepFunction(doPivot)
export const pivotNode = makeStepNode(doPivot)

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 * @param step
 * @param store
 * @returns
 */
function doPivot(input: ColumnTable, { key, value, operation }: PivotArgs) {
	const expr = singleExpression(value, operation)
	return input.pivot(key, { [value]: expr })
}
