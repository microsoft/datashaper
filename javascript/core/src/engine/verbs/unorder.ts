/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../factories.js'

export const unorder = makeStepFunction(doUnorder)
export const unorderNode = makeStepNode(doUnorder)

function doUnorder(input: ColumnTable) {
	return input.unorder()
}
