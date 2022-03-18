/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { SpreadArgs } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const spread = makeStepFunction(doSpread)
export const spreadNode = makeStepNode(doSpread)

function doSpread(input: ColumnTable, { to, column }: SpreadArgs) {
	return input.spread(column, { as: to })
}
