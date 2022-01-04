/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn, IDetailsListProps, IDropdownOption } from '@fluentui/react'
import ColumnTable from 'arquero/dist/types/table/column-table'

export type ColumnRenderFunction = (
	item?: any,
	index?: number,
	column?: IColumn,
) => any

export type DropdownOptionSelect =
	| ((
			event: React.FormEvent<HTMLDivElement>,
			option?: IDropdownOption<any> | undefined,
			index?: number | undefined,
	  ) => void)
	| undefined

export type ColumnClickFunction = (
	evt?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
	column?: IColumn | undefined,
) => void

export interface DetailsListFeatures {
	/**
	 * Indicates to auto-select the rendering for all features.
	 */
	autoRender?: boolean
	/**
	 * Include histograms in the headers of numeric columns.
	 */
	histogramColumnHeaders?: boolean
	/**
	 * Include stats in the headers of columns.
	 */
	statsColumnHeaders?: boolean
	/**
	 * Use embedded charts and vis based on data types and cell contents.
	 */
	smartCells?: boolean
	/**
	 * If datatype is array, shows a dropdown with the values
	 */
	arrayAsDropdown?: boolean
}

export interface ArqueroDetailsListProps
	extends Omit<IDetailsListProps, 'items'> {
	table: ColumnTable
	/**
	 * Indicates to introspect the data columns and provide full rich rendering automatically for everything.
	 * TODO: we could use an enum and specify levels of richness. For example, basic formatting -> header details -> full-blown smart cells.
	 */
	autoRender?: boolean
	features?: DetailsListFeatures
	offset?: number
	limit?: number
	/**
	 * Indicates whether we should include all of the columns in the table by default.
	 * If false, a columns array must be provided.
	 */
	includeAllColumns?: boolean
	isSortable?: boolean
	/**
	 * Indicates whether to use even/odd row coloring.
	 */
	isStriped?: boolean
	/**
	 * Indicates that the entire column is clickable for selection.
	 */
	isColumnClickable?: boolean
	/**
	 * Indicates to use borders between columns so the cells look more like a spreadsheet (row borders are always on).
	 */
	showColumnBorders?: boolean
	/**
	 * Passthrough to the column click handler.
	 * Will be applied to the column header only unless isColumnClickable === true.
	 * Note that if the entire column is not clickable, this is duplicative of the built-in onColumnHeaderClick
	 * and they will both fire.
	 * TODO: maybe turn this into onColumnSelect?
	 */
	onColumnClick?: ColumnClickFunction
	/**
	 * Passthrough to the column click handler.
	 * Will be applied to the column header only unless isColumnClickable === true.
	 */
	onCellDropdownSelect?: DropdownOptionSelect
	/**
	 * Key for a selected column - this is not normally an option in DetailsList
	 */
	selectedColumn?: string
}
