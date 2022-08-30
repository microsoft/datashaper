/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDelimiter } from './guessDelimiter.js'
import { validateCharacterLength } from './validators.js'

export function loadTable(text: string, options?: ParserOptions): ColumnTable {
	validateParserOptions(options)
	return fromCSV(text, {
		delimiter: options?.delimiter || guessDelimiter(text),
		...options,
	})
}

function validateParserOptions(options?: ParserOptions) {
	const validChar = validateCharacterLength(options?.comment, 1)
	if (!validChar) {
		throw new Error('Comment option should be a single character')
	}
}
