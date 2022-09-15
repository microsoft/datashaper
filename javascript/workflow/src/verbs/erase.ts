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
	return input.derive({
		[column]: escape((d: any) =>
			`${d[column]}` === `${value}` ? null : d[column],
		),
	})
}

export const erase = stepVerbFactory(eraseStep)
