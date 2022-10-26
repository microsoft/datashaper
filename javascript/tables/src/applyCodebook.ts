/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, DataTableSchema } from '@datashaper/schema'
import { CodebookStrategy, DataType } from '@datashaper/schema'
import { escape, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { parseAs } from './parseTypes.js'

export function applyCodebook(
	table: ColumnTable,
	codebook: CodebookSchema,
	strategy: CodebookStrategy,
	dataTableSchema?: DataTableSchema,
): ColumnTable {
	let applied = table

	if (
		strategy === CodebookStrategy.DataTypeOnly ||
		strategy === CodebookStrategy.DataTypeAndMapping
	) {
		const args = table.columnNames().reduce((acc, cur) => {
			const field = codebook.fields.find(element => element.name === cur)
			const parser =
				dataTableSchema != null && dataTableSchema.typeHints != null
					? parseAs(
							field != null ? field.type : DataType.String,
							dataTableSchema.typeHints,
					  )
					: parseAs(field != null ? field.type : DataType.String)
			acc[cur] = escape((d: any) => parser(d[cur]))
			return acc
		}, {} as Record<string, object>)

		applied = table.derive(args)
	}

	if (
		strategy === CodebookStrategy.MappingOnly ||
		strategy === CodebookStrategy.DataTypeAndMapping
	) {
		const fieldList = codebook.fields.filter(element => element.mapping != null)

		const args2 = fieldList.reduce((acc, cur) => {
			acc[cur.name] = escape((d: any) =>
				op.recode(d[cur.name], cur.mapping ? cur.mapping : {}),
			)
			return acc
		}, {} as Record<string, object>)

		return applied.derive(args2)
	}

	return applied
}
