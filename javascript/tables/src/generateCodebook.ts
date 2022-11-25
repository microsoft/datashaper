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

export function generateCodebook(table: ColumnTable): CodebookSchema {
	const codebookResult: CodebookSchema = createCodebookSchemaObject({
		name: 'Generator',
		fields: [],
	})

	table.columnNames().forEach(column => {
		const values: string[] = table.array(column) as string[]

		const columnType = guessDataTypeFromValues(values)
		const nature = inferNatureFromValues(values)

		const field = {
			id: 'http://json-schema.org/draft-07/schema#',
			name: column,
			type: columnType,
			nature: nature,
		}

		codebookResult.fields.push(field)
	})

	return codebookResult
}
