/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { UnfoldArgs } from '@datashaper/schema'
import { from } from 'arquero'
import type { RowObject } from 'arquero/dist/types/table/table'

import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export const unfoldStep: ColumnTableStep<UnfoldArgs> = (
	input,
	{ key, value },
) => {
	const columnNames: string[] = input.columnNames(name => {
		return name !== key && name !== value
	})
	const selectedArray: RowObject[] = input.select(columnNames).objects()

	const distinctColumnValues: string[] = [
		...new Set<string>(input.array(key) as string[]),
	]

	const originalArray: RowObject[] = input.objects()
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
	return from(finalArray)
}

export const unfold = stepVerbFactory(unfoldStep)
