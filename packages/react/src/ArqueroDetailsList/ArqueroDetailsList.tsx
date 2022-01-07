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
	ConstrainMode,
	IGroup,
} from '@fluentui/react'
import { Theme } from '@thematic/core'
import { RowObject, GroupBySpec } from 'arquero/dist/types/table/table'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
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

		const displayColumns = useColumns(table, columns, {
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

		const buildGroup = useCallback(
			(
				row: RowObject,
				existingGroups: GroupBySpec,
				actualLevel: number,
			): IGroup => {
				const value = row[0]
				const valueGroups = row[1]
				const columnName = existingGroups.names[actualLevel]
				const totalLevelCount = existingGroups.names.length

				const startIndex = sliced
					.data()
					[columnName].data.findIndex(x => x === value)

				const group = {
					key: value.toString(),
					name: value.toString(),
					startIndex: startIndex,
					level: actualLevel,
					count: valueGroups.length,
				} as IGroup

				if (actualLevel + 1 < totalLevelCount) {
					const child: IGroup[] = []

					valueGroups.forEach(valueGroup => {
						const group2 = buildGroup(
							valueGroup,
							existingGroups,
							actualLevel + 1,
						)
						child.push(group2)
					})
					group.children = child
				}
				return group
			},
			[sliced],
		)

		const groups = useMemo(() => {
			if (!sliced.isGrouped()) {
				return undefined
			}
			const existingGroups = sliced.groups()
			const groups: IGroup[] = []
			const entries = sliced.objects({ grouped: 'entries' })

			entries.forEach((row: RowObject) => {
				const initialLevel = 0
				const group = buildGroup(row, existingGroups, initialLevel)
				groups.push(group)
			})
			return groups
		}, [sliced, buildGroup])

		return (
			<DetailsWrapper>
				<DetailsList
					items={items}
					selectionMode={selectionMode}
					layoutMode={layoutMode}
					groups={groups}
					groupProps={{
						onRenderHeader: onRenderGroupHeader,
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

const DetailsWrapper = styled.div<{ theme: Theme }>`
	height: inherit;
	position: relative;
	max-height: inherit;

	span.ms-DetailsHeader-cellTitle {
		background-color: ${({ theme }) => theme.application().background().hex()};
	}
`
