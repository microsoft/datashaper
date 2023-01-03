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
			return fromArray(obj)
		case DataOrientation.Values:
			return fromValues(obj)
		default:
			throw new Error(`unknown data orientation: ${shape.orientation}`)
	}
}

function fromArray(obj: any): ColumnTable {
	// all the data is a single column
	// TODO: we should support the csv parser option to specify the headers
	// TODO: the shape has an XxY matrix, but we don't use it yet
	return fromJSON({
		col1: obj,
	})
}

function fromValues(obj: any): ColumnTable {
	// first row is assumed to be headers
	// TODO: we should support the csv parser option to specify the headers
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
