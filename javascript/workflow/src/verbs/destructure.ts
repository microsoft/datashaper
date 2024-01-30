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
	{ column, keys, prefix = 'array_', preserveSource = false },
) => {
	const tableArray: RowObject[] = input.objects()

	for (let i = 0; i < tableArray.length; i++) {
		if (tableArray[i] !== undefined && tableArray[i]![column] !== undefined) {
			tableArray[i] = destructureSingleValue(
				tableArray[i]!,
				tableArray[i]![column]!,
				Array.isArray(tableArray[i]![column]!),
				prefix,
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
	isArray: boolean,
	prefix: string,
	keys?: string[],
): RowObject {
	let index = 0
	for (let property in object) {
		if (
			keys === undefined ||
			keys.length === 0 ||
			(keys !== undefined && keys.includes(property))
		) {
			if (isArray) {
				row[prefix + index] = (object as any)[property]
			} else {
				row[property] = (object as any)[property]
			}

			index++
		}
	}

	return row
}

export const destructure = stepVerbFactory(destructureStep)
