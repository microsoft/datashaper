/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { escape } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { EraseArgs } from '../types.js'
import { makeStepNode } from './util/factories.js'

export const erase = makeStepNode<EraseArgs>(
	(input: ColumnTable, { value, column }: EraseArgs) => {
		const func = escape((d: any) =>
			d[column] === value ? undefined : d[column],
		)
		return input.derive({ [column]: func })
	},
)
