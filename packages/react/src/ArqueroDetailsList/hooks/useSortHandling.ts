/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
import { useCallback, useState } from 'react'
import { ColumnHeaderClickFunction } from '..'

export interface SortParameters {
	sortColumn?: string
	sortDirection: SortDirection
	handleColumnHeaderClick: ColumnHeaderClickFunction
}

export function useSortHandling(
	allowSorting: boolean,
	onColumnHeaderClick?: ColumnHeaderClickFunction,
): SortParameters {
	const [sortColumn, setSortColumn] = useState<string | undefined>()
	const [sortDirection, setSortDirection] = useState<SortDirection>(
		SortDirection.Ascending,
	)
	const handleColumnHeaderClick = useCallback(
		(evt, column?: IColumn) => {
			if (allowSorting) {
				if (column?.isSorted) {
					setSortDirection(
						sortDirection === SortDirection.Ascending
							? SortDirection.Descending
							: SortDirection.Ascending,
					)
				}
				setSortColumn(column?.fieldName)
			}
			onColumnHeaderClick && onColumnHeaderClick(evt, column)
		},
		[
			allowSorting,
			onColumnHeaderClick,
			setSortColumn,
			setSortDirection,
			sortDirection,
		],
	)

	return {
		sortColumn,
		sortDirection,
		handleColumnHeaderClick,
	}
}
