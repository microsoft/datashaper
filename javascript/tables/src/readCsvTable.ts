/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import { ParserOptionsDefaults } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

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
	options?: ParserOptions,
	autoType = true,
): ColumnTable {
	const valid = validOptions(options)
	if (!valid) {
		throw new Error('Some opts are not valid')
	}
	const opts = {
		...ParserOptionsDefaults,
		...options,
	}
	const parser = getParser(opts)
	return parser(text, opts, autoType)
}
