/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import { fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDelimiter } from './guessDelimiter.js'

export function readTable(text: string, options?: ParserOptions): ColumnTable {
	return fromCSV(text, {
		delimiter: options?.delimiter || guessDelimiter(text),
		...options,
	})
}
