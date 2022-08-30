/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { from } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function unhotOperation(
	input: ColumnTable,
	columns: string[],
	prefix: string,
): ColumnTable {
	const inputTable: ColumnTable = from(input.objects())

	for (let i = 0; i < columns.length; i++) {
		const columnName: any = columns[i] ?? null
		const index = columnName !== null ? columnName.indexOf(prefix) : -1
		const value =
			index !== -1 && columnName !== null
				? columnName.substring(index + prefix.length)
				: null

		const obj = inputTable.data()

		if (columnName !== null && value !== null) {
			for (
				let j = 0;
				j < inputTable.data()[columnName as keyof typeof obj]['data']['length'];
				j++
			) {
				inputTable.data()[columnName as keyof typeof obj]['data'][`${j}`] === 0
					? ((inputTable.data()[columnName as keyof typeof obj]['data'][
							`${j}`
					  ] as any) = null)
					: ((inputTable.data()[columnName as keyof typeof obj]['data'][
							`${j}`
					  ] as any) = value)
			}
		}
	}

	return inputTable
}
