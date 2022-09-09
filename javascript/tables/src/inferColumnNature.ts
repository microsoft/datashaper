/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { VariableNature } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { inferNatureFromValues } from './inferNatureFromValues.js'

export function inferColumnNature(
	table: ColumnTable,
	columnName: string,
	categoricalCountLimit = 10,
): VariableNature {
	const column = table.array(columnName)
	if (column === undefined) {
		throw new Error(
			`Unable to infer variable nature for absent column ${columnName}`,
		)
	}

	return inferNatureFromValues(column as any[], categoricalCountLimit)
}
