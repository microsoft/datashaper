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

export function readJSONTable(
	text: string,
	shape: DataShape = DEFAULT_DATA_SHAPE_JSON_OPTIONS,
): ColumnTable {
	const obj = JSON.parse(text)
	switch (shape.orientation) {
		case DataOrientation.Records:
			return from(obj)
		case DataOrientation.Columnar:
			return fromJSON(text)
		case DataOrientation.Array:
			return fromArray(obj, shape)
		case DataOrientation.Values:
			return fromValues(obj)
		default:
			throw new Error(`unknown data orientation: ${shape.orientation}`)
	}
}

function fromArray(obj: any, shape: DataShape): ColumnTable {
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
		return fromValues(result)
	}
	return fromJSON({
		col1: obj,
	})
}

function fromValues(obj: any): ColumnTable {
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
