/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { container } from '../../container.js'
import type { EraseArgs,TableContainer  } from '../../types.js'
import { makeStepFunction, makeStepNode } from '../factories.js'

export const erase = makeStepFunction(doErase)
export const eraseNode = makeStepNode(doErase)

function doErase(
	id: string,
	input: TableContainer,
	{ value, column }: EraseArgs,
) {
	let result: ColumnTable | undefined
	if (input.table != null) {
		const func = escape((d: any) =>
			d[column] === value ? undefined : d[column],
		)
		const dArgs = { [column]: func }
		result = input.table.derive(dArgs)
	}
	return container(id, result)
}
