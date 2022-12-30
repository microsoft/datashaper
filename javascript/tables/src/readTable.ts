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
import { getParser, validOptions } from './readTable.utils.js'

/**
 * Read an input table
 * @param input - The input blob
 * @param schema - The dataTableSchema with format, shape and parser of the table
 * @returns
 */
export async function readTable(
	input: Blob | undefined,
	schema: Partial<DataTableSchema>,
): Promise<ColumnTable | undefined> {
	if (input == null) {
		return Promise.resolve(undefined)
	}
	const { format, shape, parser } = schema
	switch (format) {
		case DataFormat.JSON:
			return readJSONTable(await input.text(), shape)
		case DataFormat.ARROW:
			return fromArrow(await input.arrayBuffer())
		case DataFormat.CSV:
			return fromCSV(await input.text(), parser)
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
	shapeOptions: DataShape = DEFAULT_DATA_SHAPE_JSON_OPTIONS,
): ColumnTable {
	return shapeOptions.orientation === DataOrientation.Columnar
		? fromJSON(text)
		: from(JSON.parse(text))
}
