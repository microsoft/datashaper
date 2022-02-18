/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { fromCSV } from 'arquero'
import type { CSVParseOptions } from 'arquero/dist/types/format/from-csv'
import type { HTMLFormatOptions } from 'arquero/dist/types/format/to-html'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { BaseFile } from '../common/index.js'
import { getDsvFileContent, guessDelimiter } from './files.js'

export async function loadTable(
	file: BaseFile,
	options: CSVParseOptions = {},
): Promise<ColumnTable> {
	const text = await getDsvFileContent(file)
	const delimiter = options.delimiter || guessDelimiter(file.name)
	return fromCSV(text, { ...options, delimiter })
}

export async function tableToHTML(
	file: BaseFile,
	htmlOptions: HTMLFormatOptions = {},
	tableOptions: CSVParseOptions = {},
): Promise<string> {
	const table = await loadTable(file, tableOptions)
	return table.toHTML(htmlOptions)
}
