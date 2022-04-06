/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { EraseArgs } from '../../types.js'
import { makeStepFunction, makeStepNode, wrapColumnStep } from '../factories.js'

const doErase = wrapColumnStep<EraseArgs>(
	(input: ColumnTable, { value, columns }: EraseArgs) => {
		const funcs = columns.reduce((acc, column) => {
			// TODO: this is a cheap string conversion for comparison.
			// we may want to do real type checking per cell or using table metadata for types
			acc[column] = escape((d: any) =>
				`${d[column]}` === `${value}` ? null : d[column],
			)
			return acc
		}, {} as Record<string, object>)
		return input.derive(funcs)
	},
)

export const erase = makeStepFunction(doErase)
export const eraseNode = makeStepNode(doErase)
