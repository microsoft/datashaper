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

export function concatStrategy(
	singleRow: RowObject,
	columns: string[],
	delimiter: string,
): string {
	return arrayStrategy(singleRow, columns).join(delimiter)
}
