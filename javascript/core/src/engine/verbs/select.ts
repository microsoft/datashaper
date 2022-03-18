/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { all } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { SelectArgs } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const select = makeStepFunction(doSelect)
export const selectNode = makeStepNode(doSelect)

function doSelect(input: ColumnTable, { columns = [] }: SelectArgs) {
	const expr = [columns] as any
	if (expr.length === 0) {
		expr.push(all())
	}
	return input.select(...expr)
}
