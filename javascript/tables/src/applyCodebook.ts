/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import { escape, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { parseAs } from './parseTypes.js'

export function applyCodebook(
	table: ColumnTable,
	codebook: CodebookSchema,
	applyMapping: boolean,
): ColumnTable {
	const args = table.columnNames().reduce((acc, cur) => {
		const field = codebook.fields.find(element => element.name === cur)
		const parser = parseAs(field != null ? field.type : DataType.String)
		acc[cur] = escape((d: any) => parser(d[cur]))
		return acc
	}, {} as Record<string, object>)

	const applied = table.derive(args)

	if (applyMapping) {
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
