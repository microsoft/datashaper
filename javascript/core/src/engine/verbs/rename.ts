/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { RenameArgs } from '../../types.js'

export const rename = makeStepFunction(doRename)
export const renameNode = makeStepNode(doRename)

function doRename(input: ColumnTable, { columns }: RenameArgs) {
	return input.rename(columns)
}
