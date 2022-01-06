/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

/**
 * Creates a list of column names for the table.
 * If there are no columns supplied or all = true, it will use the list from the table itsel.
 * Otherwise it will use the provided columns under the assumption the user has configured them as desired.
 * @param table
 * @param columns
 * @param all
 * @returns
 */
export function useColumnNamesList(
	table: ColumnTable,
	columns?: IColumn[],
	all = false,
): string[] {
	return useMemo(() => {
		if (!columns || all) {
			return table.columnNames()
		}
		return columns.map(c => c.name)
	}, [table, columns, all])
}
