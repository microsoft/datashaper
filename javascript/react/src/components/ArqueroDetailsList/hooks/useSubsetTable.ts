/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import isArray from 'lodash-es/isArray.js'
import { useMemo } from 'react'

export function useSubsetTable(
	table: ColumnTable,
	columns?: IColumn[],
): ColumnTable {
	return useMemo(() => {
		let existingColumnNames = table.columnNames()
		if (columns != null && columns?.length > 0) {
			// for some reason, it updates here first when changing a table.
			// doing this stops the super error from arquero while the real columns aren't re-rendered
			const tableColumns = table.columnNames()
			existingColumnNames = columns
				.map((col) => col.fieldName)
				.filter((col) => tableColumns.includes(col as string)) as string[]
		}

		// choosing wrong delimiters makes data get wrongly parsed and in some cases
		// it generates some columnsNames as arrays instead of strings with ,
		existingColumnNames = existingColumnNames.map((column) => {
			if (isArray(column)) {
				return column.join(',')
			}
			return column
		})
		return table.select(existingColumnNames)
	}, [table, columns])
}
