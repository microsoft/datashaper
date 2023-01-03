/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDelimiter } from './guessDelimiter.js'
import { DEFAULT_PARSER_OPTIONS } from './readCsvTable.constants.js'
import { getParser, validOptions } from './readCsvTable.utils.js'

/**
 * Reads CSV text into an arquero table.
 * Switches between arquero's CSV parser and papaparse based on the options.
 * (Arquero is faster but supports fewer options).
 * @param text
 * @param options
 * @returns
 */
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
