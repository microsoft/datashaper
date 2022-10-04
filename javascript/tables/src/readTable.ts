/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import { DataFormat } from '@datashaper/schema'
import { fromArrow, fromCSV, fromJSON } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDelimiter } from './guessDelimiter.js'
import { DEFAULT_PARSER_OPTIONS } from './readTable.constants.js'
import { getParser, validOptions } from './readTable.utils.js'

/**
 * Read an input table
 * @param input - The input blob
 * @param format - The data format of the table (e.g. JSON, CSV, Arrow)
 * @param options - The parsing options when using CSV
 * @returns
 */
export async function readTable(
	input: Blob | undefined,
	format: DataFormat,
	options?: ParserOptions,
): Promise<ColumnTable | undefined> {
	if (input == null) {
		return Promise.resolve(undefined)
	}
	switch (format) {
		case DataFormat.JSON:
			return fromJSON(await input.text())
		case DataFormat.ARROW:
			return fromArrow(await input.arrayBuffer())
		case DataFormat.CSV:
			return fromCSV(await input.text(), options)
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
