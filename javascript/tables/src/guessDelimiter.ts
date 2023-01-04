/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import { default as papa } from 'papaparse'

import { mapToPapaParseOptions } from './readCsvTable.utils.js'

export function guessDelimiter(text: string, config?: ParserOptions): string {
	const options = mapToPapaParseOptions(config)
	return papa.parse(text, { preview: 10, ...options }).meta.delimiter
}
