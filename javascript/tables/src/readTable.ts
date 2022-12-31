/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	DataShape,
	DataTableSchema,
	ParserOptions,
} from '@datashaper/schema'
import { DataFormat, DataOrientation } from '@datashaper/schema'
import { from, fromArrow, fromCSV, fromJSON } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDelimiter } from './guessDelimiter.js'
import {
	DEFAULT_DATA_SHAPE_JSON_OPTIONS,
	DEFAULT_PARSER_OPTIONS,
} from './readTable.constants.js'
import {
	getParser,
	mapToArqueroOptions,
	validOptions,
} from './readTable.utils.js'

/**
 * Read an input table
 * @param input - The input blob
 * @param schema - The dataTableSchema with format, shape and parser of the table
 * @returns
 */
export async function readTable(
	input: Blob | undefined,
	schema: DataTableSchema,
): Promise<ColumnTable | undefined> {
	if (input == null) {
		return Promise.resolve(undefined)
	}
	const { format, shape, parser } = schema
	const options = mapToArqueroOptions(parser)
	switch (format) {
		case DataFormat.JSON:
			return readJSONTable(await input.text(), shape)
		case DataFormat.ARROW:
			return fromArrow(await input.arrayBuffer())
		case DataFormat.CSV:
			return fromCSV(await input.text(), options)
		// TODO: use our internal parser when
		// return readCsvTable(await input.text(), parser)
		default:
			throw new Error(`unknown data format: ${format}`)
	}
}

export function readCsvTable(
	text: string,
	options: ParserOptions = DEFAULT_PARSER_OPTIONS,
): ColumnTable {
	const valid = validOptions(options)
	if (!valid) {
		throw new Error('Some options are not valid')
	}
	const parser = getParser(options)
	return parser(text, {
		delimiter: options?.delimiter || guessDelimiter(text),
		...options,
	})
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
