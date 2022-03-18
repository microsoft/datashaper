/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { UnrollArgs } from '../../types.js'

export const unroll = makeStepFunction(doUnroll)
export const unrollNode = makeStepNode(doUnroll)

function doUnroll(input: ColumnTable, { columns }: UnrollArgs) {
	return input.unroll(columns)
}
