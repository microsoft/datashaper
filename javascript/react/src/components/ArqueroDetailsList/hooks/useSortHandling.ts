/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@datashaper/schema'
import type { IColumn } from '@fluentui/react'
import { useCallback, useState } from 'react'

import type { ColumnSelectFunction } from '../index.js'

export interface SortParameters {
	sortColumn?: string
	sortDirection?: SortDirection
	defaultSortColumn?: string
	defaultSortDirection?: SortDirection
	onSort: ColumnSelectFunction
}

export function useSortHandling(
	allowSorting: boolean,
	defaultSortColumn?: string,
	defaultSortDirection: SortDirection = SortDirection.Ascending,
): SortParameters {
	const [sortColumn, setSortColumn] = useState<string | undefined>(
		defaultSortColumn,
	)
	const [sortDirection, setSortDirection] = useState<SortDirection | undefined>(
		defaultSortDirection,
	)
	const onSort = useCallback(
		(
			_evt: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
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
		},
		[allowSorting, setSortColumn, setSortDirection, sortDirection],
	)

	return {
		sortColumn,
		sortDirection,
		onSort,
	}
}
