/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	type CodebookSchema,
	createCodebookSchemaObject,
	DataType,
} from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDataTypeFromValues } from './guessDataTypeFromValues.js'
import { inferNatureFromValues } from './inferNatureFromValues.js'
import { introspect } from './introspect.js'

export function generateCodebook(
	table: ColumnTable,
	options?: {
		autoType?: boolean
		autoMax?: number
	},
): CodebookSchema {
	const codebookResult: CodebookSchema = createCodebookSchemaObject({
		name: 'Generated Codebook',
		fields: [],
	})

	const opts = {
		autoType: true,
		autoMax: Infinity,
		...options,
	}
	const metadata = introspect(table, true)

	table.columnNames().forEach(column => {
		const field = {
			...metadata.columns[column],
			name: column,
			type: DataType.String,
		}

		if (opts.autoType) {
			const values: string[] = table.array(column) as string[]
			const columnType = guessDataTypeFromValues(values, opts.autoMax)
			const nature = inferNatureFromValues(values)

			field.type = columnType
			field.nature = nature
		}

		codebookResult.fields.push(field)
	})

	return codebookResult
}
