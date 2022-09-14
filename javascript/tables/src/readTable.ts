/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ParserOptions } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { guessDelimiter } from './guessDelimiter.js'
import { COMMENT_DEFAULT, DELIMITER_DEFAULT } from './typeHints.defaults.js'
import { getParser, validOptions } from './readTable.utils.js'

const defaultParserOptions = {
	delimiter: DELIMITER_DEFAULT,
	comment: COMMENT_DEFAULT,
}

export function readTable(
	text: string,
	options: ParserOptions = defaultParserOptions,
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
