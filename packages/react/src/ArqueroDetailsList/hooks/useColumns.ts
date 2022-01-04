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
	createRenderDefaultCell,
	createRenderDefaultColumnHeader,
	createRenderDropdownCell,
	createRenderHistogramColumnHeader,
	createRenderSmartCell,
	createRenderStatsColumnHeader,
} from '../renderers'
import {
	useCellClickhandler,
	useCellDropdownSelectHandler,
	useColumnNamesList,
	useColumnStyles,
	useIncrementingColumnColorScale,
	useTableMetadata,
} from '.'

const DEFAULT_COLUMN_WIDTH = 100

export interface ColumnOptions {
	features?: DetailsListFeatures
	sortColumn?: string
	sortDirection?: SortDirection
	selectedColumn?: string
	onColumnClick?: ColumnClickFunction
	onCellDropdownSelect?: DropdownOptionSelect
	includeAllColumns?: boolean
	isColumnClickable?: boolean
	isSortable?: boolean
	showColumnBorders?: boolean
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
	columns?: IColumn[],
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
		isSortable = false,
		showColumnBorders = false,
	} = options

	const handleCellClick = useCellClickhandler(isColumnClickable, onColumnClick)
	const handleCellDropdownSelect = useCellDropdownSelectHandler(
		isColumnClickable,
		onCellDropdownSelect,
	)

	const metadata: TableMetadata = useTableMetadata(
		table,
		anyStatsFeatures(features),
	)

	const colorScale = useIncrementingColumnColorScale(metadata)

	const styles = useColumnStyles(
		isColumnClickable,
		isSortable,
		showColumnBorders,
	)

	const names = useColumnNamesList(table, columns, includeAllColumns)

	return useMemo(() => {
		const columnMap = reduce(columns)

		return names.map(name => {
			const column = columnMap[name] || {
				key: name,
				name,
				minWidth: DEFAULT_COLUMN_WIDTH,
				fieldName: name,
			}

			// HACK: if we let an iconName through, the rendering messes with our layout.
			// In order to control this we'll pass the original props to the generators,
			// but omit from what gets sent to the top-level table.
			// As far as I can tell there's no other way to force the table to let us control this icon rendering
			// without completely recreating the details header render
			const { iconName, ...defaults } = column

			const meta = metadata.columns[name]
			const color = meta.type === DataType.Number ? colorScale() : undefined
			const onRender =
				features.arrayAsDropdown && meta.type === DataType.Array
					? createRenderDropdownCell(handleCellDropdownSelect)
					: features.autoRender || features.smartCells
					? createRenderSmartCell(meta, color, handleCellClick)
					: createRenderDefaultCell(meta, handleCellClick)

			const headerRenderers = [createRenderDefaultColumnHeader(column)]
			if (features.autoRender || features.statsColumnHeaders) {
				headerRenderers.push(createRenderStatsColumnHeader(meta))
			}
			if (features.autoRender || features.histogramColumnHeaders) {
				headerRenderers.push(createRenderHistogramColumnHeader(meta, color))
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
		metadata,
		colorScale,
		handleCellDropdownSelect,
	])
}

function anyStatsFeatures(features?: DetailsListFeatures) {
	return Object.values(features || {}).some(v => v)
}
function reduce(columns?: IColumn[]): Record<string, IColumn> {
	return (columns || []).reduce((acc, cur) => {
		acc[cur.name] = cur
		return acc
	}, {} as Record<string, IColumn>)
}
