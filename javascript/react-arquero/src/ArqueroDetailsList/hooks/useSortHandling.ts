/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SortDirection } from '@data-wrangling-components/core'
import { noop } from '@data-wrangling-components/react-controls'
import type { IColumn } from '@fluentui/react'
import { useCallback, useState } from 'react'

import type { ColumnClickFunction } from '../index.js'

export interface SortParameters {
	sortColumn?: string
	sortDirection?: SortDirection
	handleColumnHeaderClick: ColumnClickFunction
}

export function useSortHandling(
	allowSorting: boolean,
	onColumnHeaderClick: ColumnClickFunction = noop,
): SortParameters {
	const [sortColumn, setSortColumn] = useState<string | undefined>()
	const [sortDirection, setSortDirection] = useState<
		SortDirection | undefined
	>()
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
