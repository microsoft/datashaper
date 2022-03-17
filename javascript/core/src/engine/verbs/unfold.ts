/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { from } from 'arquero'
import type { RowObject } from 'arquero/dist/types/table/table'

import { container } from '../../factories.js'
import type { TableStore } from '../../index.js'
import type { TableContainer,UnfoldStep } from '../../types.js'

/**
 * Executes an arquero fold operation. This creates two new columns:
 * one with the column name as key, the other with the row value.
 * @param step
 * @param store
 * @returns
 */
export async function unfold(
	{ input, output, args: { key, value } }: UnfoldStep,
	store: TableStore,
): Promise<TableContainer> {
	const inputTable = await store.table(input)

	const columnNames: string[] = inputTable.columnNames(name => {
		return name !== key && name !== value
	})
	const selectedArray: RowObject[] = inputTable.select(columnNames).objects()

	const distinctColumnValues: string[] = [
		...new Set<string>(inputTable.array(key) as string[]),
	]

	const originalArray: RowObject[] = inputTable.objects()
	const finalArray: RowObject[] = []

	const upperValue: number =
		selectedArray.length !== 0
			? selectedArray.length / distinctColumnValues.length
			: distinctColumnValues.length

	for (let i = 0; i < upperValue; i++) {
		let tempObj: RowObject = {}

		if (selectedArray.length !== 0) {
			tempObj = {
				...selectedArray[i * distinctColumnValues.length],
			}
		}

		let j: number = i * distinctColumnValues.length

		distinctColumnValues.forEach(e => {
			const obj: RowObject | undefined = originalArray[j]
			tempObj[e] = obj !== undefined ? obj[value] : null
			j++
		})

		finalArray.push(tempObj)
	}

	return container(output, from(finalArray))
}
