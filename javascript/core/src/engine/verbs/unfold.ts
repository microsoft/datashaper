/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { from } from 'arquero'
import type { RowObject } from 'arquero/dist/types/table/table'
import { container } from '../../factories.js'
import type { TableStore, UnfoldArgs } from '../../index.js'
import type { Step, TableContainer } from '../../types.js'

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 * @param step
 * @param store
 * @returns
 */
export async function unfold(
	step: Step,
	store: TableStore,
): Promise<TableContainer> {
	const { input, output, args } = step
	const { key, value } = args as UnfoldArgs
	const inputTable = await store.table(input)

	const columnNames: string[] = inputTable.columnNames(name => {
		return name !== key && name !== value
	})
	const selectedArray: RowObject[] = inputTable.select(columnNames).objects()

	const distinctColumnValues: string[] = [...new Set(inputTable.array(key))]

	const originalArray: RowObject[] = inputTable.objects()
	const finalArray: RowObject[] = []

	for (let i = 0; i < selectedArray.length / distinctColumnValues.length; i++) {
		const tempObj: RowObject = {
			...selectedArray[i * distinctColumnValues.length],
		}

		let j: number = i * distinctColumnValues.length

		distinctColumnValues.forEach(e => {
			const obj: RowObject | undefined = originalArray.at(j)
			tempObj[e] = obj !== undefined ? obj[value] : null
			j++
		})

		finalArray.push(tempObj)
	}

	return container(output, from(finalArray))
}
