/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { EraseArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doErase = wrapColumnStep<EraseArgs>(
	(input: ColumnTable, { value, column }: EraseArgs) => {
		const func = escape((d: any) =>
			d[column] === value ? undefined : d[column],
		)
		const dArgs = { [column]: func }
		return input.derive(dArgs)
	},
)

export const erase = makeStepFunction(doErase)
export const eraseNode = makeStepNode(doErase)
