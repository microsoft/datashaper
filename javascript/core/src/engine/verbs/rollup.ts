/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { RollupArgs } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'
import { singleExpression } from '../util/index.js'

export const rollup = makeStepFunction(doRollup)
export const rollupNode = makeStepNode(doRollup)

export function doRollup(
	input: ColumnTable,
	{ column, operation, to }: RollupArgs,
) {
	const expr = singleExpression(column, operation)
	return input.rollup({ [to]: expr })
}
