/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsListStyles } from '@fluentui/react'
import {
	ConstrainMode,
	DetailsList,
	DetailsListLayoutMode,
	SelectionMode,
} from '@fluentui/react'
import { memo, useMemo } from 'react'

import {
	useGetKey,
	useGroupProps,
	useGroups,
	useListProps,
	useOnColumnResizeHandler,
	useVersion,
	useVirtualizedItems,
} from './ArqueroDetailsList.hooks.js'
import { DetailsWrapper } from './ArqueroDetailsList.styles.js'
import type { ArqueroDetailsListProps } from './ArqueroDetailsList.types.js'
import {
	useColumns,
	useDetailsHeaderRenderer,
	useDetailsListStyles,
	useSlicedTable,
	useSortedTable,
	useSortHandling,
	useStripedRowsRenderer,
	useSubsetTable,
} from './hooks/index.js'

/**
 * Renders an arquero table using a fluent DetailsList.
 */
export const ArqueroDetailsList: React.FC<ArqueroDetailsListProps> = memo(
	function ArqueroDetailsList({
		table,
		validationResult,
		features = {},
		metadata,
		offset = 0,
		limit = Infinity,
		sortable = false,
		striped = false,
		clickableColumns = false,
		showColumnBorders = false,
		fill = false,
		selectedColumn,
		onColumnClick,
		onCellDropdownSelect,
		onRenderGroupHeader,
		// extract props we want to set data-centric defaults for
		selectionMode = SelectionMode.none,
		layoutMode = DetailsListLayoutMode.fixedColumns,
		columns,
		onColumnHeaderClick,
		styles,
		defaultSortColumn,
		defaultSortDirection,
		isHeaderFixed = false,
		compact = false,
		resizable = true,
		style,
		// passthrough the remainder as props
		...props
	}) {
		const [version, setVersion] = useVersion(table, columns, compact)
		const { sortColumn, sortDirection, onSort } = useSortHandling(
			sortable,
			defaultSortColumn,
			defaultSortDirection,
		)

		// first subset the table using the visible columns
		// this will prevent any further operations on columns we aren't going to show
		const subset = useSubsetTable(table, columns)
		// sort the table internally
		// note that this is different than the orderby of a pipeline step
		// this is a temporary sort only for the table display
		const sorted = useSortedTable(subset, sortColumn, sortDirection)
		// slice any potential page
		const sliced = useSlicedTable(sorted, offset, limit)

		// last, copy these items to actual JS objects for the DetailsList
		const { virtual, items, ref } = useVirtualizedItems(
			sliced,
			columns,
			features,
			fill,
			compact,
		)

		const isDefaultHeaderClickable = useMemo<boolean>(() => {
			return sortable || clickableColumns || !!onColumnHeaderClick
		}, [sortable, clickableColumns, onColumnHeaderClick])

		const onColumnResize = useOnColumnResizeHandler(setVersion)

		const displayColumns = useColumns(
			table,
			metadata,
			columns,
			onColumnHeaderClick,
			onSort,
			{
				features,
				sortColumn,
				sortDirection,
				selectedColumn,
				onColumnClick,
				onCellDropdownSelect,
				isDefaultHeaderClickable,
				isClickable: clickableColumns,
				isSortable: sortable,
				showColumnBorders,
				compact,
				resizable,
			},
			virtual.virtualColumns,
		)

		const headerStyle = useDetailsListStyles(
			isHeaderFixed,
			features,
			styles as IDetailsListStyles,
			!!onColumnClick,
			compact,
		)

		const renderRow = useStripedRowsRenderer(striped, showColumnBorders)
		const renderDetailsHeader = useDetailsHeaderRenderer()
		const groups = useGroups(
			table,
			sliced,
			items,
			sortDirection,
			features,
			sortColumn,
		)
		const groupProps = useGroupProps(
			table,
			metadata,
			onRenderGroupHeader,
			features,
		)

		return (
			<DetailsWrapper
				ref={ref}
				data-is-scrollable="true"
				showColumnBorders={showColumnBorders}
				style={style}
			>
				<DetailsList
					items={[...items]}
					selectionMode={selectionMode}
					layoutMode={layoutMode}
					groups={groups}
					getKey={useGetKey()}
					groupProps={groupProps}
					columns={displayColumns}
					constrainMode={ConstrainMode.unconstrained}
					onRenderRow={renderRow}
					onRenderDetailsHeader={renderDetailsHeader}
					onColumnResize={onColumnResize}
					compact={compact}
					{...props}
					listProps={useListProps(version)}
					styles={headerStyle}
				/>
			</DetailsWrapper>
		)
	},
)
