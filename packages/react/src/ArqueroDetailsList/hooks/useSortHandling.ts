/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
import { useCallback, useState } from 'react'
import { ColumnClickFunction } from '..'

export interface SortParameters {
	sortColumn?: string
	sortDirection: SortDirection
	handleColumnHeaderClick: ColumnClickFunction
}

export function useSortHandling(
	allowSorting: boolean,
	onColumnHeaderClick?: ColumnClickFunction,
): SortParameters {
	const [sortColumn, setSortColumn] = useState<string | undefined>()
	const [sortDirection, setSortDirection] = useState<SortDirection>(
		SortDirection.Unsorted,
	)
	const handleColumnHeaderClick = useCallback(
		(
			evt: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
			column?: IColumn,
		) => {
			if (allowSorting) {
				if (column?.isSorted) {
					setSortDirection(
						sortDirection === SortDirection.Ascending
							? SortDirection.Descending
							: sortDirection === SortDirection.Descending
							? SortDirection.Unsorted
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
