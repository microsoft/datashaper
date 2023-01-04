/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema } from '@datashaper/schema'
import { DataFormat } from '@datashaper/schema'
import { fromArrow, fromCSV } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

// import { readCsvTable } from './readCsvTable.js'
import { mapToArqueroOptions } from './readCsvTable.utils.js'
import { readJSONTable } from './readJSONTable.js'

/**
 * Read an input table
 * @param input - The input blob
 * @param schema - The dataTableSchema with format, shape and parser of the table
 * @returns
 */
export async function readTable(
	input: Blob | undefined,
	schema: DataTableSchema,
): Promise<ColumnTable | undefined> {
	if (input == null) {
		return Promise.resolve(undefined)
	}
	const { format, shape, parser } = schema
	const options = mapToArqueroOptions(parser)
	switch (format) {
		case DataFormat.JSON:
			return readJSONTable(await input.text(), shape)
		case DataFormat.ARROW:
			return fromArrow(await input.arrayBuffer())
		case DataFormat.CSV:
			return fromCSV(await input.text(), options)
		//return readCsvTable(await input.text(), parser)
		default:
			throw new Error(`unknown data format: ${format}`)
	}
}
