/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	DetailsList,
	DetailsListLayoutMode,
	IColumn,
	SelectionMode,
	IDetailsListProps,
} from '@fluentui/react'
import type { internal as ArqueroTypes } from 'arquero'
import React, { memo, useMemo } from 'react'
import {
	useColumns,
	useSlicedTable,
	useReifiedTable,
	useSortedTable,
	useSortHandling,
} from './hooks'

export interface ArqueroDetailsListProps
	extends Omit<IDetailsListProps, 'items'> {
	table: ArqueroTypes.ColumnTable
	offset?: number
	limit?: number
	allowSorting?: boolean
}

/**
 * Renders an arquero table using a fluent DetailsList.
 */
export const ArqueroDetailsList: React.FC<ArqueroDetailsListProps> = memo(
	function ArqueroDetailsList(props) {
		const {
			table,
			offset = 0,
			limit = Infinity,
			allowSorting = true,
			// extract props we want to set data-centric defaults for
			selectionMode = SelectionMode.none,
			layoutMode = DetailsListLayoutMode.fixedColumns,
			columns,
			onColumnHeaderClick,
			// passthrough the remainder as props
			...rest
		} = props

		const { sortColumn, sortDirection, handleColumnHeaderClick } =
			useSortHandling(allowSorting, onColumnHeaderClick)

		// NOTE: these all copy the table. if we see perf issues, we can perform inline operations and then use a table scan to extract a subset for render
		// first apply sort to internal table copy
		const sorted = useSortedTable(table, sortColumn, sortDirection)
		// slice any potential page
		const sliced = useSlicedTable(sorted, offset, limit)
		// reify before display in order to materialize the orderby and filter settings in an Arquero table
		const copied = useReifiedTable(sliced)
		// last, copy these items to actual JS objects for the DetailsList
		const items = useMemo(() => copied.objects(), [copied])

		const displayColumns = useColumns(table, columns, sortColumn, sortDirection)

		return (
			<DetailsList
				items={items}
				selectionMode={selectionMode}
				layoutMode={layoutMode}
				columns={displayColumns as IColumn[]}
				onColumnHeaderClick={handleColumnHeaderClick}
				{...rest}
			/>
		)
	},
)
