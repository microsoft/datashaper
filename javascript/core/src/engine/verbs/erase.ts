/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { makeStepFunction, makeStepNode } from '../../factories.js'
import type { EraseArgs } from '../../types.js'

export const erase = makeStepFunction(doErase)
export const eraseNode = makeStepNode(doErase)

/**
 * Executes an arquero erase operation.
 * @param step
 * @param store
 * @returns
 */
function doErase(input: ColumnTable, { value, column }: EraseArgs) {
	const func = escape((d: any) => (d[column] === value ? undefined : d[column]))
	const dArgs = { [column]: func }
	return input.derive(dArgs)
}
