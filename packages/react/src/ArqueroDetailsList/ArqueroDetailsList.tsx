/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	DetailsList,
	DetailsListLayoutMode,
	IColumn,
	SelectionMode,
	IDetailsListStyles,
} from '@fluentui/react'
import React, { memo, useMemo } from 'react'
import {
	useColumns,
	useDetailsHeaderRenderer,
	useDetailsListStyles,
	useSlicedTable,
	useSortedTable,
	useSortHandling,
	useStripedRowsRenderer,
} from './hooks'
import { ArqueroDetailsListProps } from '.'

/**
 * Renders an arquero table using a fluent DetailsList.
 */
export const ArqueroDetailsList: React.FC<ArqueroDetailsListProps> = memo(
	function ArqueroDetailsList(props) {
		const {
			table,
			features = {},
			offset = 0,
			limit = Infinity,
			includeAllColumns = true,
			isSortable = false,
			isStriped = false,
			isColumnClickable = false,
			selectedColumn,
			onColumnClick,
			// extract props we want to set data-centric defaults for
			selectionMode = SelectionMode.none,
			layoutMode = DetailsListLayoutMode.fixedColumns,
			columns,
			onColumnHeaderClick,
			styles,
			// passthrough the remainder as props
			...rest
		} = props

		const { sortColumn, sortDirection, handleColumnHeaderClick } =
			useSortHandling(isSortable, onColumnHeaderClick)

		// first apply sort to internal table copy
		// note that this is different than the orderby of a pipeline step
		// this is a temporary sort only for the table display
		const sorted = useSortedTable(table, sortColumn, sortDirection)
		// slice any potential page
		const sliced = useSlicedTable(sorted, offset, limit)
		// last, copy these items to actual JS objects for the DetailsList
		const items = useMemo(() => sliced.objects(), [sliced])

		const displayColumns = useColumns(table, columns, {
			features,
			sortColumn,
			sortDirection,
			selectedColumn,
			onColumnClick,
			includeAllColumns,
			isColumnClickable,
			isSortable,
		})

		const headerStyle = useDetailsListStyles(
			features,
			styles as IDetailsListStyles,
		)

		const renderRow = useStripedRowsRenderer(isStriped)
		const renderDetailsHeader = useDetailsHeaderRenderer()

		return (
			<DetailsList
				items={items}
				selectionMode={selectionMode}
				layoutMode={layoutMode}
				columns={displayColumns as IColumn[]}
				onColumnHeaderClick={handleColumnHeaderClick}
				onRenderRow={renderRow}
				onRenderDetailsHeader={renderDetailsHeader}
				{...rest}
				styles={headerStyle}
			/>
		)
	},
)
