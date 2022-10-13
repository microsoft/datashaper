/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { escape, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { ExprObject } from 'arquero/dist/types/table/transformable'

import { parseAs } from './parseTypes.js'

export function unapplyCodebook(
	table: ColumnTable,
	codebook: CodebookSchema,
	applyMapping: boolean,
): ColumnTable {
	const args = table.columnNames().reduce((acc, cur) => {
		const field = codebook.fields.find(element => element.name === cur)
		const parser = parseAs(DataType.String)
		acc[cur] = escape((d: any) => parser(d[cur]))
		return acc
	}, {} as Record<string, ExprObject>)

	table = table.derive(args)

	if (applyMapping) {
		const fieldList = codebook.fields.filter(element => element.mapping != null)

		fieldList.map(field => {
			const finalMap: Record<any, any> = {}

			for (const key in field.mapping) {
				const value = field.mapping[key]
				finalMap[value] = key
			}

			table = table.derive({
				[field.name]: escape((d: any) => op.recode(d[field.name], finalMap)),
			})
		})
	}

	return table
}
