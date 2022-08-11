/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@datashaper/arquero'
import type { IColumn } from '@fluentui/react'
import { useCallback, useState } from 'react'

import { noop } from '../../functions.js'
import type { ColumnClickFunction } from '../index.js'

export interface SortParameters {
	sortColumn?: string
	sortDirection?: SortDirection
	defaultSortColumn?: string
	defaultSortDirection?: SortDirection
	handleColumnHeaderClick: ColumnClickFunction
}

export function useSortHandling(
	allowSorting: boolean,
	onColumnHeaderClick: ColumnClickFunction = noop,
	defaultSortColumn?: string,
	defaultSortDirection?: SortDirection,
): SortParameters {
	const [sortColumn, setSortColumn] = useState<string | undefined>(
		defaultSortColumn,
	)
	const [sortDirection, setSortDirection] =
		useState<SortParameters['sortDirection']>(defaultSortDirection)
	const handleColumnHeaderClick = useCallback(
		(
			evt: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
			column?: IColumn,
		) => {
			if (allowSorting) {
				if (column?.isSorted || !sortDirection) {
					setSortDirection(
						sortDirection === SortDirection.Ascending
							? SortDirection.Descending
							: sortDirection === SortDirection.Descending
							? undefined
							: SortDirection.Ascending,
					)
				}
				setSortColumn(column?.fieldName)
			}
			onColumnHeaderClick(evt, column)
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
