/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SortDirection } from '@data-wrangling-components/core'
import {
	DetailsList,
	DetailsListLayoutMode,
	IColumn,
	SelectionMode,
	IDetailsListStyles,
	ConstrainMode,
	IGroup,
} from '@fluentui/react'
import { RowObject, GroupBySpec } from 'arquero/dist/types/table/table'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
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
	useTableMetadata,
} from './hooks'
import { ArqueroDetailsListProps, DetailsListFeatures } from '.'

/**
 * Renders an arquero table using a fluent DetailsList.
 */
export const ArqueroDetailsList: React.FC<ArqueroDetailsListProps> = memo(
	function ArqueroDetailsList(props) {
		const {
			table,
			features = {},
			metadata,
			offset = 0,
			limit = Infinity,
			includeAllColumns = true,
			isSortable = false,
			isStriped = false,
			isColumnClickable = false,
			showColumnBorders = false,
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
			isHeadersFixed = false,
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

		const computedMetadata = useTableMetadata(
			table,
			metadata,
			anyStatsFeatures(features),
		)

		const displayColumns = useColumns(table, computedMetadata, columns, {
			features,
			sortColumn,
			sortDirection,
			selectedColumn,
			onColumnClick,
			onCellDropdownSelect,
			includeAllColumns,
			isColumnClickable,
			isSortable,
			showColumnBorders,
		})

		const headerStyle = useDetailsListStyles(
			isHeadersFixed,
			features,
			styles as IDetailsListStyles,
		)

		const renderRow = useStripedRowsRenderer(isStriped, showColumnBorders)
		const renderDetailsHeader = useDetailsHeaderRenderer()
		const renderGroupHeader = useGroupHeaderRenderer(
			table,
			computedMetadata,
			onRenderGroupHeader,
		)

		const sortValueGroupsItems = useCallback(
			(
				entries: RowObject[],
				existingGroups: any,
				nextLevel: number,
			): RowObject[] => {
				const columnName = existingGroups.names[nextLevel]
				if (sortColumn && sortColumn !== columnName) return entries
				return sortDirection === SortDirection.Ascending
					? entries.sort((a, b) => a[0] - b[0])
					: entries.sort((a, b) => b[0] - a[0])
			},
			[sortDirection, sortColumn],
		)

		const buildGroup = useCallback(
			(
				row: RowObject,
				existingGroups: GroupBySpec,
				actualLevel: number,
				totalLevelCount: number,
				fatherIndex = 0,
			): IGroup => {
				const value = row[0]
				const valueGroups = row[1]
				const columnName = existingGroups.names[actualLevel]

				const startIndex =
					items.slice(fatherIndex).findIndex(x => x[columnName] === value) +
					fatherIndex

				const group = {
					key: value.toString(),
					name: value.toString(),
					startIndex: startIndex,
					level: actualLevel,
					count: valueGroups.length,
				} as IGroup

				if (actualLevel + 1 < totalLevelCount) {
					const nextLevel = actualLevel + 1
					const children = sortValueGroupsItems(
						valueGroups,
						existingGroups,
						nextLevel,
					).map(valueGroup => {
						return buildGroup(
							valueGroup,
							existingGroups,
							nextLevel,
							totalLevelCount,
							startIndex,
						)
					})
					group.children = children
				}
				return group
			},
			[items, sortValueGroupsItems],
		)

		const groups = useMemo(() => {
			if (!sliced.isGrouped()) {
				return undefined
			}

			const existingGroups = sliced.groups()
			const totalLevelCount = existingGroups.names.length

			return sortedGroups?.map((row: RowObject) => {
				const initialLevel = 0
				return buildGroup(row, existingGroups, initialLevel, totalLevelCount)
			})
		}, [sliced, buildGroup, sortedGroups])

		return (
			<DetailsWrapper>
				<DetailsList
					items={items}
					selectionMode={selectionMode}
					layoutMode={layoutMode}
					groups={groups}
					groupProps={{
						onRenderHeader: renderGroupHeader,
					}}
					columns={displayColumns as IColumn[]}
					onColumnHeaderClick={handleColumnHeaderClick}
					constrainMode={ConstrainMode.unconstrained}
					onRenderRow={renderRow}
					onRenderDetailsHeader={renderDetailsHeader}
					{...rest}
					styles={headerStyle}
				/>
			</DetailsWrapper>
		)
	},
)

const DetailsWrapper = styled.div`
	height: inherit;
	position: relative;
	max-height: inherit;

	span.ms-DetailsHeader-cellTitle {
		background-color: ${({ theme }) => theme.application().background().hex()};
	}
`

function anyStatsFeatures(features?: DetailsListFeatures) {
	return Object.values(features || {}).some(v => v)
}
