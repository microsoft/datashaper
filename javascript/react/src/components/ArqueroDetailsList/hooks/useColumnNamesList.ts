/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IColumn } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'

/**
 * Creates a list of column names for the table.
 * If there are no columns supplied it will use the list from the table itself.
 * Otherwise it will use the provided columns under the assumption the user has configured them as desired.
 * @param table -
 * @param columns -
 * @returns
 */
export function useColumnNamesList(
	table: ColumnTable,
	columns?: IColumn[],
): string[] {
	return useMemo(() => {
		const list = !columns ? table.columnNames() : columns.map(c => c.name)
		return list
	}, [table, columns])
}
