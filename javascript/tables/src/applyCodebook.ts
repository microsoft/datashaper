/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, DataTableSchema } from '@datashaper/schema'
import { CodebookStrategy } from '@datashaper/schema'
import { escape, not, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { parseAs } from './parseTypes.js'

export function applyCodebook(
	table: ColumnTable,
	codebook: CodebookSchema,
	strategy: CodebookStrategy,
	dataTableSchema?: Partial<DataTableSchema>,
): ColumnTable {
	const exclude = codebook.fields.filter((f) => f.exclude).map((f) => f.name)
	let applied = table.select(not(exclude))

	if (
		strategy === CodebookStrategy.DataTypeOnly ||
		strategy === CodebookStrategy.DataTypeAndMapping
	) {
		const args = codebook.fields.reduce((acc, cur) => {
			if (!cur.exclude) {
				const parser =
					dataTableSchema?.typeHints != null
						? parseAs(cur.type, dataTableSchema.typeHints)
						: parseAs(cur.type)
				acc[cur.name] = escape((d: any) => parser(d[cur.name]))
			}
			return acc
		}, {} as Record<string, object>)

		applied = applied.derive(args)
	}

	if (
		strategy === CodebookStrategy.MappingOnly ||
		strategy === CodebookStrategy.DataTypeAndMapping
	) {
		const fieldList = codebook.fields.filter(
			(element) => element.mapping != null,
		)

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
