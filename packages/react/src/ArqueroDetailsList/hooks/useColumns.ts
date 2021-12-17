/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
import type { internal as ArqueroTypes } from 'arquero'
import { useMemo } from 'react'
import { useColumnDefaults } from '.'

export function useColumns(
	table: ArqueroTypes.ColumnTable,
	columns?: IColumn[],
	sortColumn?: string,
	sortDirection?: SortDirection,
): IColumn[] {
	const columnDefaults = useColumnDefaults(table, columns)
	return useMemo(() => {
		return columnDefaults.map(column => ({
			...column,
			isSorted: column.fieldName === sortColumn ? true : false,
			isSortedDescending: sortDirection === SortDirection.Descending,
		}))
	}, [columnDefaults, sortColumn, sortDirection])
}
