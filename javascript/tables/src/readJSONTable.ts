/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataShape, DataTableSchema } from '@datashaper/schema'
import {
	DataFormat,
	DataOrientation,
	DataTableSchemaDefaults,
} from '@datashaper/schema'
import { from, fromJSON } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import merge from 'lodash-es/merge.js'

// TODO: arquero actually does perform some autoTyping on json values
export function readJSONTable(
	text: string,
	schema?: Partial<DataTableSchema>,
): ColumnTable {
	const obj = JSON.parse(text)
	const _schema = defaultSchema(schema)
	const { shape } = _schema
	const orientation = shape?.orientation ?? DataOrientation.Records

	switch (orientation) {
		case DataOrientation.Records:
			return fromJSONRecords(obj)
		case DataOrientation.Columnar:
			return fromJSONColumnar(obj)
		case DataOrientation.Array:
			return fromJSONArray(obj, shape)
		case DataOrientation.Values:
			return fromJSONValues(obj)
		default:
			throw new Error(`unknown data orientation: ${orientation}`)
	}
}

function defaultSchema(
	schema?: Partial<DataTableSchema>,
): Partial<DataTableSchema> {
	return merge(
		{},
		DataTableSchemaDefaults,
		{
			format: DataFormat.JSON,
			shape: {
				// default for JSON
				orientation: DataOrientation.Records,
			},
		},
		schema,
	)
}

export function fromJSONRecords(obj: any): ColumnTable {
	return from(obj)
}

export function fromJSONColumnar(obj: any): ColumnTable {
	return fromJSON(obj)
}

export function fromJSONArray(obj: any, shape?: DataShape): ColumnTable {
	// all the data is a single column unless a matrix row x col layout is specified
	if (shape?.matrix && shape?.matrix.length === 2) {
		const [rows, cols] = shape?.matrix
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
