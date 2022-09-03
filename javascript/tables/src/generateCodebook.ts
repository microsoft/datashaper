/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Codebook } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDataTypeByColumn } from './guessDataTypeByColumn.js'

export function generateCodebook(table: ColumnTable): Codebook {
	const codebookResult: Codebook = {
		$schema: '???',
		name: 'Generator',
		fields: [],
	}

	table.columnNames().forEach(column => {
		const columnType = guessDataTypeByColumn(table.array(column) as string[])

		const field = {
			name: column,
			type: columnType,
		}

		codebookResult.fields.push(field)
	})

	return codebookResult
}
