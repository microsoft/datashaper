/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ParserOptions } from '@datashaper/schema'
import type { BaseFile } from '@datashaper/utilities'
import { loadTable } from '@datashaper/utilities'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

export async function loadCsvTable(
	file: BaseFile,
	options: ParserOptions = {},
): Promise<ColumnTable> {
	return loadTable(file, { ...options })
}
