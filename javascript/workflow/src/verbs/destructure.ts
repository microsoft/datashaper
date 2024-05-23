/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DestructureArgs } from '@datashaper/schema'

import { from, not } from 'arquero'
import { op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { RowObject } from 'arquero/dist/types/table/table'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const destructureStep: ColumnTableStep<DestructureArgs> = (
	input,
	{ column, keys, preserveSource = false },
) => {
	const tableArray: RowObject[] = input.objects()

	for (let i = 0; i < tableArray.length; i++) {
		if (tableArray[i] !== undefined && tableArray[i]?.[column] !== undefined) {
			tableArray[i] = destructureSingleValue(
				tableArray[i] ?? {},
				tableArray[i]?.[column] ?? {},
				keys,
			)
		}
	}

	const finalTable: ColumnTable = from(tableArray)

	return preserveSource ? finalTable : finalTable.select(not(column))
}

function destructureSingleValue(
	row: RowObject,
	object: JSON,
	keys?: string[],
): RowObject {
	op.entries(object).forEach(function (entry) {
		const [key, value] = entry
		if (keys === undefined || keys.length === 0 || keys?.includes(key)) {
			const val = isEmpty(value) ? null : value
			row[key] = val
		}
	})
	return row
}

export const destructure = stepVerbFactory(destructureStep)

function isEmpty(value: string | number | boolean | Date | null | undefined) {
	if (value === null || value === undefined) {
		return true
	}
	if (typeof value === 'number' && isNaN(value)) {
		return true
	}
	if (typeof value === 'string' && value.length === 0) {
		return true
	}
	return false
}
