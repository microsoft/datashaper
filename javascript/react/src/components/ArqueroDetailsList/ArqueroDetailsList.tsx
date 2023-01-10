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
import { memo } from 'react'

import { COMPACT_ROW_HEIGHT } from './ArqueroDetailsList.constants.js'
import {
	useFields,
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
		fields,
		offset = 0,
		limit = Infinity,
		sortable = false,
		striped = false,
		showColumnBorders = false,
		fill = false,
		selectedColumn,
		onColumnSelect,
		onCellDropdownSelect,
		onRenderGroupHeader,
		// extract props we want to set data-centric defaults for
		selectionMode = SelectionMode.none,
		layoutMode = DetailsListLayoutMode.fixedColumns,
		columns,
		styles,
		defaultSortColumn,
		defaultSortDirection,
		isHeaderFixed = false,
		compact = false,
		resizable = true,
		compactRowHeight = COMPACT_ROW_HEIGHT,
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

		const fieldsInternal = useFields(table, fields)

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
			compactRowHeight,
		)

		const onColumnResize = useOnColumnResizeHandler(setVersion)

		const displayColumns = useColumns(
			table,
			fieldsInternal,
			metadata,
			columns,
			onColumnSelect,
			onSort,
			validationResult,
			{
				features,
				sortColumn,
				sortDirection,
				selectedColumn,
				onCellDropdownSelect,
				sortable,
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
			!!onColumnSelect,
			compact,
		)

		const renderRow = useStripedRowsRenderer(
			striped,
			showColumnBorders,
			compactRowHeight,
		)
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
			fieldsInternal,
			onRenderGroupHeader,
			features,
		)

		return (
			<DetailsWrapper
				ref={ref}
				data-is-scrollable="true"
				compact={compact}
				compactRowHeight={compactRowHeight}
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
