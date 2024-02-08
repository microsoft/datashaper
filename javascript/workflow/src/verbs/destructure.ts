/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DestructureArgs } from '@datashaper/schema'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'
import { not, from } from 'arquero'
import type { RowObject } from 'arquero/dist/types/table/table'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

export const destructureStep: ColumnTableStep<DestructureArgs> = (
	input,
	{ column, keys, preserveSource = false },
) => {
	const tableArray: RowObject[] = input.objects()

	for (let i = 0; i < tableArray.length; i++) {
		if (tableArray[i] !== undefined && tableArray[i]![column] !== undefined) {
			tableArray[i] = destructureSingleValue(
				tableArray[i]!,
				tableArray[i]![column]!,
				keys,
			)
		}
	}

	let finalTable: ColumnTable = from(tableArray)

	return preserveSource ? finalTable : finalTable.select(not(column))
}

function destructureSingleValue(
	row: RowObject,
	object: JSON,
	keys?: string[],
): RowObject {
	for (let property in object) {
		if (
			keys === undefined ||
			keys.length === 0 ||
			(keys !== undefined && keys.includes(property))
		) {
			row[property] = (object as any)[property]
		}
	}

	return row
}

export const destructure = stepVerbFactory(destructureStep)
