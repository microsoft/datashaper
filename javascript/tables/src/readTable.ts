/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CodebookSchema,
	DataTableSchema,
	DataTableSchemaDefaults,
} from '@datashaper/schema'
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
	options?: {
		/**
		 * If a codebook is supplied, we'll use this for type casting.
		 */
		codebook?: CodebookSchema
		/**
		 * If true, we'll try to auto-detect the type of each column.
		 * This is ignored if a codebook is supplied.
		 */
		autoType?: boolean
		/**
		 * If autoType is true, we'll limit the rows we check to this number to avoid scanning the entire table.
		 * This is ignored if a codebook is supplied.
		 */
		autoMax?: number
	},
): Promise<ColumnTable | undefined> {
	if (input == null) {
		return Promise.resolve(undefined)
	}
	const _schema = defaultSchema(schema)
	const _opts = defaultOptions(options)
	const { format, parser } = _schema
	const aOpts = mapToArqueroOptions(parser, _opts.autoType, _opts.autoMax)
	switch (format) {
		case DataFormat.JSON:
			return readJSONTable(await input.text(), _schema)
		case DataFormat.ARROW:
			return fromArrow(await input.arrayBuffer())
		case DataFormat.CSV:
			return fromCSV(await input.text(), aOpts)
		//return readCsvTable(await input.text(), parser)
		default:
			throw new Error(`unknown data format: ${format}`)
	}
}

function defaultSchema(schema: DataTableSchema): DataTableSchema {
	return {
		...DataTableSchemaDefaults,
		...schema,
	}
}

function defaultOptions(options?: {
	codebook?: CodebookSchema
	autoType?: boolean
	autoMax?: number
}): {
	codebook?: CodebookSchema
	autoType?: boolean
	autoMax?: number
} {
	return {
		codebook: undefined,
		autoType: true,
		autoMax: 1000,
		...options,
	}
}
