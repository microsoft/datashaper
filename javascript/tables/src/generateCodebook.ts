/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Codebook } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { guessDataTypeFromValues } from './guessDataTypeFromValues.js'

export function generateCodebook(table: ColumnTable): Codebook {
	const codebookResult: Codebook = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		id: 'http://json-schema.org/draft-07/schema#',
		name: 'Generator',
		fields: [],
	}

	table.columnNames().forEach(column => {
		const columnType = guessDataTypeFromValues(table.array(column) as string[])

		const field = {
			id: 'http://json-schema.org/draft-07/schema#',
			name: column,
			type: columnType,
		}

		codebookResult.fields.push(field)
	})

	return codebookResult
}
