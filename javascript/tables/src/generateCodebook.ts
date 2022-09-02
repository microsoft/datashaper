/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Codebook, Field } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDataTypeByColumn } from './guessDataTypeByColumn.js'

export function generateCodebook(table: ColumnTable): Codebook {
	const codebookResult: Codebook = {}
	const fieldResults: Field[] = []

	table.columnNames().forEach(column => {
		const columnType = guessDataTypeByColumn(table.array(column))

		const field: Field = {
			name: column,
			type: columnType,
		}

		fieldResults.push(field)
	})

	codebookResult.fields = fieldResults

	return codebookResult
}
