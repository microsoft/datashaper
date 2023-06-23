/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	type CodebookSchema,
	type Field,
	createCodebookSchemaObject,
	DataType,
	type DataFormat,
} from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDataTypeFromValues } from './guessDataTypeFromValues.js'
import { inferNatureFromValues } from './inferNatureFromValues.js'
import { parseAs } from './parseTypes.js'

export async function generateCodebook(
	table: ColumnTable,
	options?: {
		format?: DataFormat
		autoType?: boolean
		autoMax?: number
		onInferring?: (column: string) => void
		onProgress?: (numComplete: number) => void
	},
): Promise<CodebookSchema> {
	const codebook: CodebookSchema = createCodebookSchemaObject({
		fields: [],
	})

	const opts = {
		autoType: true,
		autoMax: Infinity,
		...options,
	}

	let numComplete = 0

	const processColumn = async (column: string) => {
		return new Promise<void>((resolve, reject) => {
			options?.onInferring?.(column)
			setTimeout(() => {
				try {
					const field: Field = {
						name: column,
						type: DataType.String,
					}

					if (opts.autoType) {
						const values: string[] = table.array(column) as string[]
						const columnType = guessDataTypeFromValues(values, opts.autoMax)
						field.type = columnType
						if (columnType === DataType.Array) {
							// TODO: is it worth finding the nature _within_ arrays?
							// right now they will not be assigned a nature
							const arrayParse = parseAs(DataType.Array)
							// we re-parse arrays as strings in case the table is already typed and the value is a live array
							const flat = values.flatMap((v) =>
								v ? arrayParse(v.toString()) : null,
							)
							const subtype = guessDataTypeFromValues(flat, opts.autoMax)
							field.subtype = subtype
						} else {
							const parse = parseAs(columnType)
							const parsed = values.map(parse)
							field.nature = inferNatureFromValues(parsed, {
								limit: opts.autoMax,
							})
						}
					}

					numComplete += 1
					options?.onProgress?.(numComplete)
					codebook.fields.push(field)
					resolve()
				} catch (e) {
					reject(e)
				}
			}, 0)
		})
	}

	for (const column of table.columnNames()) {
		await processColumn(column)
	}

	return codebook
}
