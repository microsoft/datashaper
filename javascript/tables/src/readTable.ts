/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import { DataFormat } from '@datashaper/schema'
import { fromJSON } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDelimiter } from './guessDelimiter.js'
import { getParser, validOptions } from './readTable.utils.js'
import { COMMENT_DEFAULT, DELIMITER_DEFAULT } from './typeHints.defaults.js'

const DEFAULT_PARSER_OPTIONS: ParserOptions = {
	delimiter: DELIMITER_DEFAULT,
	comment: COMMENT_DEFAULT,
}

/**
 * Read an input table
 * @param input - The input blob
 * @param format - The data format of the table (e.g. JSON, CSV, Arrow)
 * @param options - The parsing options when using CSV
 * @returns
 */
export async function readTable(
	input: Blob,
	format: DataFormat,
	options?: ParserOptions,
): Promise<ColumnTable> {
	if (format === DataFormat.JSON) {
		return fromJSON(await input.text())
	} else if (format === DataFormat.CSV) {
		return readCsvTable(await input.text(), options)
	} else {
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
