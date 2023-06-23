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
import type { ReadTableOptions } from './types.js'

/**
 * Read an input table
 * @param input - The input blob
 * @param schema - The dataTableSchema with format, shape and parser of the table
 * @returns
 */
export async function readTable(
	input: Blob | string | undefined,
	schema: Partial<DataTableSchema>,
	options?: ReadTableOptions,
): Promise<ColumnTable | undefined> {
	if (input == null) {
		return Promise.resolve(undefined)
	}
	const table = await readTableInner(input, schema)
	const opts = defaultOptions(options)

	// TODO: should we eventually perform some casting/typing work on arrow tables? They're already strongly typed
	if (!isBinaryFormat(schema.format) && (opts?.codebook || opts?.autoType)) {
		const codebook =
			opts?.codebook ?? (await inferCodebook(table, schema.format, opts))
		return applyCodebook(table, codebook, CodebookStrategy.DataTypeOnly, schema)
	}
	return table
}

function isBinaryFormat(format: DataFormat | undefined) {
	return format === DataFormat.ARROW
}

async function inferCodebook(
	table: ColumnTable,
	format: DataFormat | undefined,
	opts: ReadTableOptions,
) {
	if (opts.codebook != null) {
		return opts.codebook
	} else {
		return await generateCodebook(table, {
			format,
			autoType: opts.autoType,
			autoMax: opts.autoMax,
		})
	}
}

/**
 * The the core table parsing. Note that this should return a table of text,
 * with no typing applied (subject to default behaviors within JSON and Arrow of course).
 * @param input
 * @param schema
 * @returns
 */
async function readTableInner(
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
