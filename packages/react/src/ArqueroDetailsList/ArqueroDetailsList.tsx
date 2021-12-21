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
	useSortedTable,
	useSortHandling,
} from './hooks'
import { useTableMetadata } from './hooks/useTableMetadata'

export interface ArqueroDetailsListProps
	extends Omit<IDetailsListProps, 'items'> {
	table: ArqueroTypes.ColumnTable
	/**
	 * Indicates to introspect the data columns and provide full rich rendering automatically for everything.
	 * TODO: we could use an enum and specify levels of richness. For example, basic formatting -> header details -> full-blown smart cells.
	 */
	autoRender?: boolean
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
			autoRender = false,
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

		// first apply sort to internal table copy
		// note that this is different than the orderby of a pipeline step
		// this is a temporary sort only for the table display
		const sorted = useSortedTable(table, sortColumn, sortDirection)
		// slice any potential page
		const sliced = useSlicedTable(sorted, offset, limit)
		// last, copy these items to actual JS objects for the DetailsList
		// TODO: an iterator facade over the table compatible with DetailsList to avoid this copy?
		const items = useMemo(() => sliced.objects(), [sliced])

		const meta = useTableMetadata(table, autoRender)
		const displayColumns = useColumns(
			table,
			meta,
			columns,
			sortColumn,
			sortDirection,
		)

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
