/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Value } from '@datashaper/schema'
import type { RowObject } from 'arquero/dist/types/table/table'

export function firstOneWinsStrategy(
	singleRow: RowObject,
	columns: string[],
): Value {
	const firstCol = columns[0]
	if (firstCol == null) {
		throw new Error('no valid first column')
	}
	let firstValidValue: Value = singleRow[firstCol]
	let foundFirstValidValue = false
	let i = 0

	while (!foundFirstValidValue && i < columns.length) {
		const col = columns[i]
		if (col != null) {
			const sr = singleRow[col]
			if (sr != null) {
				firstValidValue = sr
				foundFirstValidValue = true
			}
		}
		i++
	}

	return firstValidValue
}

export function lastOneWinsStrategy(
	singleRow: RowObject,
	columns: string[],
): Value {
	const firstCol = columns[0]
	if (firstCol == null) {
		throw new Error('no columns available')
	}

	let lastValidValue: Value | undefined = singleRow[firstCol]
	for (let i = 0; i < columns.length; i++) {
		const col = columns[i]
		if (col != null) {
			const sr = singleRow[col]
			if (sr != null) {
				lastValidValue = sr
			}
		}
	}

	if (lastValidValue == null) {
		throw new Error('no valid values')
	}
	return lastValidValue
}

export function arrayStrategy(
	singleRow: RowObject,
	columns: string[],
): Value[] {
	const concat = []

	for (let i = 0; i < columns.length; i++) {
		const col = columns[i]
		if (col != null) {
			const sr = singleRow[col]
			if (sr != null) {
				concat.push(sr)
			}
		}
	}

	return concat
}

/**
 * TODO: use https://uwdata.github.io/arquero/api/op#row_object?
 * @param singleRow - the row to collapse
 * @param columns 
 * @returns 
 */
export function dictStrategy(
	singleRow: RowObject,
	columns: string[],
): Record<string, Value> | null {
	if (columns.length !== 2) {
		throw new Error(
			`merge strategy 'CreateDict' requires exactly two columns, found ${columns.length}`,
		)
	}

	const [keysCol, valuesCol] = columns
	if (keysCol == null || valuesCol == null) {
		throw new Error(`merge strategy 'CreateDict' requires two valid column names`)
	}
	
	const keys = singleRow[keysCol]
	const values = singleRow[valuesCol]

	if (!Array.isArray(keys)) {
		throw new Error(
			`merge strategy 'CreateDict' requires 'key' column to be an array, found ${keys} in ${JSON.stringify(singleRow)}`
		)
	}
	if (!Array.isArray(values)) {
		throw new Error(
			`merge strategy 'CreateDict' requires 'value' column to be an array, found ${values}`,
		)
	}

	const result: Record<string, any> = []
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		const value = values[i]
		if (key != null && value != null) {
			result[key] = value
		}
	}
	return result
}

export function concatStrategy(
	singleRow: RowObject,
	columns: string[],
	delimiter: string,
): string {
	return arrayStrategy(singleRow, columns).join(delimiter)
}
