/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'

export const ungroup = makeStepFunction(doUngroup)
export const ungroupNode = makeStepNode(doUngroup)

function doUngroup(input: ColumnTable) {
	return input.ungroup()
}
