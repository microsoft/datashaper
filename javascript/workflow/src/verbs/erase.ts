/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { EraseArgs } from '@datashaper/schema'
import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const eraseStep: ColumnTableStep<EraseArgs> = (
	input: ColumnTable,
	{ value, column }: EraseArgs,
) => {
	const funcs = column.reduce((acc, col) => {
		// TODO: this is a cheap string conversion for comparison.
		// we may want to do real type checking per cell or using table metadata for types
		acc[col] = escape((d: any) => (`${d[col]}` === `${value}` ? null : d[col]))
		return acc
	}, {} as Record<string, object>)
	return input.derive(funcs)
}

export const erase = stepVerbFactory(eraseStep)
