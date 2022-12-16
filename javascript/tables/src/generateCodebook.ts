/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	type CodebookSchema,
	createCodebookSchemaObject,
} from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDataTypeFromValues } from './guessDataTypeFromValues.js'
import { inferNatureFromValues } from './inferNatureFromValues.js'
import { introspect } from './introspect.js'

export function generateCodebook(
	table: ColumnTable,
): Omit<CodebookSchema, 'name'> {
	const codebookResult: CodebookSchema = createCodebookSchemaObject({
		name: 'Generator',
		fields: [],
	})

	const metadata = introspect(table, true)

	table.columnNames().forEach(column => {
		const values: string[] = table.array(column) as string[]
		const columnType = guessDataTypeFromValues(values)
		const nature = inferNatureFromValues(values)

		const field = {
			...metadata.columns[column],
			name: column,
			type: columnType,
			nature: nature,
		}

		codebookResult.fields.push(field)
	})

	return codebookResult
}
