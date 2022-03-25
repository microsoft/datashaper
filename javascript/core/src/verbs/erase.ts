/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { ColumnTableStep } from './util/factories.js'
import { stepNodeFactory } from './util/factories.js'
import type { Value } from '../tables/types.js'

export interface EraseArgs {
	column: string
	value: Value
}

export const eraseStep: ColumnTableStep<EraseArgs> = (
	input: ColumnTable,
	{ value, column }: EraseArgs,
) => {
	const func = escape((d: any) => (d[column] === value ? undefined : d[column]))
	return input.derive({ [column]: func })
}

export const erase = stepNodeFactory(eraseStep)
