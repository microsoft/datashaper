/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataType, Value } from '@datashaper/schema'
import { columnType } from '@datashaper/tables'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { RowObject } from 'arquero/dist/types/table/table'

export function isSameDataType(
	inputTable: ColumnTable,
	columns: string[],
): boolean {
	let allTypesAreTheSame = true
	const lastDataType: DataType = columnType(inputTable, columns[0]!)
	let i = 1

	while (allTypesAreTheSame === true && i < columns.length) {
		const dataType: DataType = columnType(inputTable, columns[i]!)
		allTypesAreTheSame = lastDataType === dataType
		i++
	}

	return allTypesAreTheSame
}

export function firstOneWinsStrategy(
	isSameDataTypeFlag: boolean,
	singleRow: RowObject,
	columns: string[],
): Value {
	let firstValidValue: Value = singleRow[columns[0]!]
	let foundFirstValidValue = false
	let i = 0

	while (!foundFirstValidValue && i < columns.length) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			firstValidValue = singleRow[columns[i]!]
			foundFirstValidValue = true
		}
		i++
	}

	return isSameDataTypeFlag ? firstValidValue : '' + firstValidValue
}

export function lastOneWinsStrategy(
	isSameDataTypeFlag: boolean,
	singleRow: RowObject,
	columns: string[],
): Value {
	let lastValidValue: Value = singleRow[columns[0]!]

	for (let i = 0; i < columns.length; i++) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			lastValidValue = singleRow[columns[i]!]
		}
	}

	return isSameDataTypeFlag ? lastValidValue : '' + lastValidValue
}

export function arrayStrategy(
	singleRow: RowObject,
	columns: string[],
): Value[] {
	const concat = []

	for (let i = 0; i < columns.length; i++) {
		if (
			singleRow[columns[i]!] !== undefined &&
			singleRow[columns[i]!] !== null
		) {
			concat.push(singleRow[columns[i]!])
		}
	}

	return concat
}

export function concatStrategy(
	singleRow: RowObject,
	columns: string[],
	delimiter: string,
): string {
	return arrayStrategy(singleRow, columns).join(delimiter)
}
