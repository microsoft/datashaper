/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '@datashaper/schema'
import type { DataTableSchema } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { escape, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { parseAs } from './parseTypes.js'

export function unapplyCodebook(
	table: ColumnTable,
	codebook: CodebookSchema,
	applyMapping: boolean,
	dataTableSchema?: DataTableSchema,
): ColumnTable {
	const args = table.columnNames().reduce((acc, cur) => {
		const parser =
			dataTableSchema != null && dataTableSchema.typeHints != null
				? parseAs(DataType.String, dataTableSchema.typeHints)
				: parseAs(DataType.String)
		acc[cur] = escape((d: any) => parser(d[cur]))
		return acc
	}, {} as Record<string, object>)

	const applied = table.derive(args)

	if (applyMapping) {
		const fieldList = codebook.fields.filter(element => element.mapping != null)

		const args2 = fieldList.reduce((acc, cur) => {
			const finalMap: Record<any, any> = {}

			for (const key in cur.mapping) {
				const value = cur.mapping[key]
				finalMap[value] = key
			}

			acc[cur.name] = escape((d: any) => op.recode(d[cur.name], finalMap))
			return acc
		}, {} as Record<string, object>)

		return applied.derive(args2)
	}

	return applied
}
