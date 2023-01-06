/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, DataTableSchema } from '@datashaper/schema'
import {
	CodebookStrategy,
	DataFormat,
	DataTableSchemaDefaults,
} from '@datashaper/schema'
import { fromArrow } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { applyCodebook } from './applyCodebook.js'
import { generateCodebook } from './generateCodebook.js'
import { readCsvTable } from './readCsvTable.js'
import { readJSONTable } from './readJSONTable.js'

/**
 * Read an input table
 * @param input - The input blob
 * @param schema - The dataTableSchema with format, shape and parser of the table
 * @returns
 */
export async function readTable(
	input: Blob | string | undefined,
	schema: Partial<DataTableSchema>,
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
	const table = await textTable(input, schema)
	const opts = defaultOptions(options)
	if (opts?.codebook || opts?.autoType) {
		return applyTyping(table, schema, opts)
	}
	return table
}

/**
 * The the core table parsing. Note that this should return a table of text,
 * with no typing applied (subject to default behaviors within JSON and Arrow of course).
 * @param input
 * @param schema
 * @returns
 */
async function textTable(
	input: Blob | string,
	schema: Partial<DataTableSchema>,
): Promise<ColumnTable> {
	const _schema = defaultSchema(schema)
	const { format } = _schema
	const getTableText = async () =>
		typeof input === 'string' ? input : await input.text()
	switch (format) {
		case DataFormat.JSON:
			return readJSONTable(await getTableText(), _schema)
		case DataFormat.ARROW:
			if (typeof input === 'string') {
				throw new Error('Arrow format requires a binary Blob input')
			}
			return fromArrow(await input.arrayBuffer())
		case DataFormat.CSV:
			return readCsvTable(await getTableText(), _schema)
		default:
			throw new Error(`unknown data format: ${format}`)
	}
}

function applyTyping(
	table: ColumnTable,
	schema: Partial<DataTableSchema>,
	options: {
		codebook?: CodebookSchema
		autoType?: boolean
		autoMax?: number
	},
): ColumnTable {
	const codebook =
		options.codebook ||
		generateCodebook(table, {
			autoType: options.autoType,
			autoMax: options.autoMax,
		})
	return applyCodebook(table, codebook, CodebookStrategy.DataTypeOnly, schema)
}

function defaultSchema(
	schema: Partial<DataTableSchema>,
): Partial<DataTableSchema> {
	return {
		...DataTableSchemaDefaults,
		...schema,
	}
}

function defaultOptions(options?: {
	codebook?: CodebookSchema
	autoType?: boolean
	autoMax?: number
}) {
	return {
		autoType: true,
		autoMax: 1000,
		...options,
	}
}
