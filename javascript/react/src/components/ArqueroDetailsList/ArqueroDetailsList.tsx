/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from '@essex/styled-components'
import type { IColumn, IDetailsListStyles } from '@fluentui/react'
import {
	ConstrainMode,
	DetailsList,
	DetailsListLayoutMode,
	SelectionMode,
} from '@fluentui/react'
import type { RowObject } from 'arquero/dist/types/table/table'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { ArqueroDetailsListProps } from './ArqueroDetailsList.types.js'
import { debounceFn, groupBuilder } from './ArqueroDetailsList.utils.js'
import {
	useColumns,
	useDetailsHeaderRenderer,
	useDetailsListStyles,
	useGroupHeaderRenderer,
	useSlicedTable,
	useSortedGroups,
	useSortedTable,
	useSortHandling,
	useStripedRowsRenderer,
	useSubsetTable,
} from './hooks/index.js'
import { useFill } from './hooks/useFill.js'
import { useItems } from './hooks/useItems.js'

/**
 * Renders an arquero table using a fluent DetailsList.
 */
export const ArqueroDetailsList: React.FC<ArqueroDetailsListProps> = memo(
	function ArqueroDetailsList({
		table,
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
		// passthrough the remainder as props
		...props
	}) {
		const ref = useRef(null)

		const [version, setVersion] = useState(0)
		const { sortColumn, sortDirection, handleColumnHeaderClick } =
			useSortHandling(
				sortable,
				onColumnHeaderClick,
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
		const baseItems = useMemo(() => [...sliced.objects()], [sliced])
		const virtual = useFill(sliced, columns, ref, fill, features, { compact })
		const items = useItems(baseItems, virtual.virtualRows)

		// if the table is grouped, groups the information in a way we can iterate
		const groupedEntries = useMemo(
			() =>
				table.isGrouped() ? sliced.objects({ grouped: 'entries' }) : undefined,
			[sliced, table],
		)

		// sorts first level group headers
		const sortedGroups = useSortedGroups(
			table,
			sortColumn,
			sortDirection,
			groupedEntries,
		)

		const isDefaultHeaderClickable = useMemo((): any => {
			return sortable || clickableColumns || !!onColumnHeaderClick
		}, [sortable, clickableColumns, onColumnHeaderClick])

		const onColumnResize = useCallback(
			(column: IColumn | undefined, newWidth: number | undefined) => {
				const set = () => setVersion(prev => prev + 1)
				if (column?.currentWidth !== newWidth) {
					debounceFn(set)
				}
			},
			[setVersion],
		)

		const displayColumns = useColumns(
			table,
			metadata,
			columns,
			handleColumnHeaderClick,
			{
				features,
				sortColumn,
				sortDirection,
				selectedColumn,
				onColumnClick,
				onCellDropdownSelect,
				isDefaultHeaderClickable,
				isClickable: clickableColumns,
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
		const renderGroupHeader = useGroupHeaderRenderer(
			table,
			metadata,
			onRenderGroupHeader,
			features.lazyLoadGroups,
		)

		const groups = useMemo(() => {
			if (!sliced.isGrouped()) {
				return undefined
			}

			const existingGroups = sliced.groups()
			const totalLevelCount = existingGroups.names.length

			return sortedGroups?.map((row: RowObject) => {
				const initialLevel = 0
				return groupBuilder(
					row,
					existingGroups,
					initialLevel,
					totalLevelCount,
					items,
					sortDirection,
					features.lazyLoadGroups,
					sortColumn,
				)
			})
		}, [sliced, sortedGroups, items, sortColumn, sortDirection, features])
		// as in FluentUI documentation, when updating item we can update the list items with a spread operator.
		// since when adding a new column we're changing the columns prop too, this approach doesn't work for that.
		// a workaround found in the issues suggest to use this version property to use as comparison to force re-render
		useEffect(() => {
			setVersion(prev => prev + 1)
		}, [columns, table, compact])

		return (
			<DetailsWrapper
				ref={ref}
				data-is-scrollable="true"
				showColumnBorders={showColumnBorders}
			>
				<DetailsList
					items={[...items]}
					selectionMode={selectionMode}
					layoutMode={layoutMode}
					groups={groups}
					getKey={(_: any, index?: number) => {
						return (index as number).toString()
					}} //To be sure that every key is unique
					groupProps={{
						onRenderHeader: renderGroupHeader,
					}}
					columns={displayColumns}
					constrainMode={ConstrainMode.unconstrained}
					onRenderRow={renderRow}
					onRenderDetailsHeader={renderDetailsHeader}
					onColumnResize={onColumnResize}
					compact={compact}
					{...props}
					listProps={{
						version,
					}}
					styles={headerStyle}
				/>
			</DetailsWrapper>
		)
	},
)

const DetailsWrapper = styled.div<{ showColumnBorders: boolean }>`
	height: inherit;
	position: relative;
	max-height: inherit;
	overflow-y: auto;
	overflow-x: auto;
	border: ${({ theme, showColumnBorders }) =>
		showColumnBorders ? `1px solid ${theme.palette.neutralLighter}` : 'none'};
	span.ms-DetailsHeader-cellTitle {
		background-color: ${({ theme }) => theme.palette.white};
	}

	.ms-List-cell {
		min-height: unset;
	}

	.ms-CommandBar {
		padding: unset;
	}

	.ms-OverflowSet {
		justify-content: center;
	}
`
