/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { parseAs } from './parseTypes.js'

export function applyCodebook(
	table: ColumnTable,
	codebook: CodebookSchema,
): ColumnTable {
	table.columnNames().forEach(column => {
		// eslint-disable-next-line
		const func = escape((d: any) => {
			const field = codebook.fields.find(element => element.name === column)
			const parser = parseAs(field.type)
			const l = d[column]
			return parser(l)
		})

		return table.derive({ [column]: func })
	})
}
