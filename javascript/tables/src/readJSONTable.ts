/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataShape } from '@datashaper/schema'
import { DataOrientation } from '@datashaper/schema'
import { from, fromJSON } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

const DEFAULT_DATA_SHAPE_JSON_OPTIONS: DataShape = {
	orientation: DataOrientation.Records,
}

// TODO: arquero actually does perform some autoTyping on json values
export function readJSONTable(
	text: string,
	shape: DataShape = DEFAULT_DATA_SHAPE_JSON_OPTIONS,
): ColumnTable {
	const obj = JSON.parse(text)
	switch (shape.orientation) {
		case DataOrientation.Records:
			return fromJSONRecords(obj)
		case DataOrientation.Columnar:
			return fromJSONColumnar(obj)
		case DataOrientation.Array:
			return fromJSONArray(obj, shape)
		case DataOrientation.Values:
			return fromJSONValues(obj)
		default:
			throw new Error(`unknown data orientation: ${shape.orientation}`)
	}
}

export function fromJSONRecords(obj: any) {
	return from(obj)
}

export function fromJSONColumnar(obj: any) {
	return fromJSON(obj)
}

export function fromJSONArray(obj: any, shape: DataShape): ColumnTable {
	// all the data is a single column unless a matrix row x col layout is specified
	if (shape.matrix) {
		const [rows, cols] = shape.matrix
		// transpose into an array of arrays and then just use the fromValues function
		// note that we're completely assuming the matrix definition is correct
		const result = []
		for (let i = 0; i < rows * cols; i += cols) {
			const row = obj.slice(i, i + cols)
			result.push(row)
		}
		return fromJSONValues(result)
	}
	return fromJSON({
		col1: obj,
	})
}

export function fromJSONValues(obj: any): ColumnTable {
	// first row is assumed to be headers (as stated in schema)
	const headers = obj[0]
	const data = obj.slice(1)
	const map = headers.reduce(
		(acc: Record<string, unknown[]>, cur: unknown, idx: number) => {
			acc[`${cur}`] = data.map((row: unknown[]) => row[idx])
			return acc
		},
		{},
	)
	return fromJSON(map)
}
