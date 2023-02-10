/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	type CodebookSchema,
	type Field,
	createCodebookSchemaObject,
	DataType,
} from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDataTypeFromValues } from './guessDataTypeFromValues.js'
import { inferNatureFromValues } from './inferNatureFromValues.js'
import { parseAs } from './parseTypes.js'

export function generateCodebook(
	table: ColumnTable,
	options?: {
		autoType?: boolean
		autoMax?: number
	},
): CodebookSchema {
	const codecook: CodebookSchema = createCodebookSchemaObject({
		fields: [],
	})

	const opts = {
		autoType: true,
		autoMax: Infinity,
		...options,
	}

	table.columnNames().forEach((column) => {
		const field: Field = {
			name: column,
			type: DataType.String,
		}

		if (opts.autoType) {
			const values: string[] = table.array(column) as string[]
			const columnType = guessDataTypeFromValues(values, opts.autoMax)
			const parse = parseAs(columnType)
			const parsed = values.map(parse)
			field.nature = inferNatureFromValues(parsed, {
				limit: opts.autoMax,
			})
			field.type = columnType
			if (columnType === DataType.Array) {
				// TODO: is it worth finding the nature _within_ arrays?
				// right now they will always default to "continuous"
				const arrayParse = parseAs(DataType.Array)
				const flat = values.flatMap((v) => arrayParse(v))
				const subtype = guessDataTypeFromValues(flat, opts.autoMax)
				field.subtype = subtype
			}
		}

		codecook.fields.push(field)
	})

	return codecook
}
