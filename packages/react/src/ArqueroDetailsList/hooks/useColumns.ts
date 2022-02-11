/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DataType,
	SortDirection,
	TableMetadata,
} from '@data-wrangling-components/core'
import { IColumn } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo } from 'react'
import {
	ColumnClickFunction,
	DetailsListFeatures,
	DropdownOptionSelect,
} from '..'
import {
	createRenderColumnHeader,
	createRenderCommandBarColumnHeader,
	createRenderDefaultColumnHeader,
	createRenderFeaturesCell,
	createRenderHistogramColumnHeader,
	createRenderSmartCell,
	createRenderStatsColumnHeader,
} from '../renderers'
import { useCountMinWidth } from './useCountMinWidth'
import {
	useCellClickhandler,
	useCellDropdownSelectHandler,
	useColumnNamesList,
	useColumnStyles,
	useIncrementingColumnColorScale,
} from '.'

export interface ColumnOptions {
	features?: DetailsListFeatures
	sortColumn?: string
	sortDirection?: SortDirection
	selectedColumn?: string
	onColumnClick?: ColumnClickFunction
	onCellDropdownSelect?: DropdownOptionSelect
	includeAllColumns?: boolean
	isColumnClickable?: boolean
	isDefaultHeaderClickable?: boolean
	showColumnBorders?: boolean
	compact?: boolean
}

/**
 * Overlays a number of special features onto the IColumn objects for a table.
 * This includes overridden renderers to support our sorting, selection, and data visualization.
 * @param table
 * @param columns
 * @param options
 * @returns
 */
export function useColumns(
	table: ColumnTable,
	computedMetadata: TableMetadata,
	columns?: IColumn[],
	visibleColumns?: string[],
	handleColumnHeaderClick?: ColumnClickFunction,
	options: ColumnOptions = {},
): IColumn[] {
	const {
		features = {},
		sortColumn,
		sortDirection,
		selectedColumn,
		onColumnClick,
		onCellDropdownSelect,
		includeAllColumns = false,
		isColumnClickable = false,
		isDefaultHeaderClickable = false,
		showColumnBorders = false,
		compact = false,
	} = options

	const handleCellClick = useCellClickhandler(isColumnClickable, onColumnClick)
	const handleCellDropdownSelect = useCellDropdownSelectHandler(
		isColumnClickable,
		onCellDropdownSelect,
	)

	const colorScale = useIncrementingColumnColorScale(computedMetadata)

	const styles = useColumnStyles(isColumnClickable, showColumnBorders)

	const names = useColumnNamesList(
		table,
		columns,
		includeAllColumns,
		visibleColumns,
	)
	const columnMinWidth = useCountMinWidth(features.commandBar)

	return useMemo(() => {
		const columnMap = reduce(columns)
		return names.map(name => {
			// const commands = features.commandBar?.map(x => x())
			const column = columnMap[name] || {
				key: name,
				name,
				minWidth: columnMinWidth,
				fieldName: name,
			}

			// HACK: if we let an iconName through, the rendering messes with our layout.
			// In order to control this we'll pass the original props to the generators,
			// but omit from what gets sent to the top-level table.
			// As far as I can tell there's no other way to force the table to let us control this icon rendering
			// without completely recreating the details header render
			const { iconName, ...defaults } = column

			const meta = computedMetadata.columns[name]
			const color = meta.type === DataType.Number ? colorScale() : undefined
			const onRender = features.smartCells
				? createRenderSmartCell(
						meta,
						color,
						handleCellClick,
						handleCellDropdownSelect,
				  )
				: createRenderFeaturesCell(
						features,
						meta,
						color,
						handleCellClick,
						handleCellDropdownSelect,
				  )

			const headerRenderers = [
				createRenderDefaultColumnHeader(
					column,
					isDefaultHeaderClickable,
					handleColumnHeaderClick,
				),
			]

			if (features.commandBar) {
				headerRenderers.push(
					createRenderCommandBarColumnHeader(features.commandBar),
				)
			}
			if (features.smartHeaders || features.statsColumnHeaders) {
				headerRenderers.push(
					createRenderStatsColumnHeader(
						meta,
						features.onStatsColumnHeaderClick,
						features.statsColumnTypes,
					),
				)
			}
			if (features.smartHeaders || features.histogramColumnHeaders) {
				headerRenderers.push(
					createRenderHistogramColumnHeader(
						meta,
						color,
						features.onHistogramColumnHeaderClick,
					),
				)
			}

			return {
				onRender,
				onRenderHeader: createRenderColumnHeader(headerRenderers),
				onColumnClick,
				isSorted: column.fieldName === sortColumn ? true : false,
				isSortedDescending: sortDirection === SortDirection.Descending,
				styles,
				...defaults,
				data: {
					selected: column.key === selectedColumn,
					compact,
					...column.data,
				},
			}
		})
	}, [
		columns,
		names,
		features,
		sortColumn,
		sortDirection,
		selectedColumn,
		onColumnClick,
		handleCellClick,
		styles,
		compact,
		computedMetadata,
		colorScale,
		handleCellDropdownSelect,
		isDefaultHeaderClickable,
		handleColumnHeaderClick,
		columnMinWidth,
	])
}

function reduce(columns?: IColumn[]): Record<string, IColumn> {
	return (columns || []).reduce((acc, cur) => {
		acc[cur.name] = cur
		return acc
	}, {} as Record<string, IColumn>)
}
