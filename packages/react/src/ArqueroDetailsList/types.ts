/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ColumnMetadata, TableMetadata } from '@data-wrangling-components/core'
import {
	IColumn,
	IDetailsListProps,
	IDropdownOption,
	IDetailsGroupDividerProps,
} from '@fluentui/react'
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

export type GroupHeaderFunction = (
	meta?: ColumnMetadata,
	props?: IDetailsGroupDividerProps | undefined,
) => any

export type ColumnClickFunction = (
	evt?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
	column?: IColumn | undefined,
) => void

export interface DetailsListFeatures {
	/**
	 * Includes stats and histograms in the headers of columns
	 */
	smartHeaders?: boolean
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
	 * Without smartCells, if datatype is boolean, shows a symbol
	 */
	showBooleanSymbol?: boolean
	/**
	 * Without smartCells, if datatype is number, shows the magnitude of the value
	 */
	showNumberMagnitude?: boolean
	/**
	 * Without smartCells, if datatype is array, shows a categorical bar
	 */
	showCategoricalBar?: boolean
	/**
	 * Without smartCells, if datatype is date, shows the date formatted
	 */
	showDateFormatted?: boolean
	/**
	 * Without smartCells, if datatype is array, shows a sparkbar
	 */
	showSparkbar?: boolean
	/**
	 * Without smartCells, if datatype is array, shows a sparkline
	 */
	showSparkline?: boolean
	/**
	 * Without smartCells, If datatype is array, shows a dropdown with the values
	 */
	showDropdown?: boolean
	/**
	 * Collapse most groups so we can lazy load them. Default as true
	 */
	lazyLoadGroups?: boolean
}

export interface ArqueroDetailsListProps
	extends Omit<IDetailsListProps, 'items'> {
	table: ColumnTable
	features?: DetailsListFeatures
	/**
	 * Optional metadata to use for column smart features.
	 * Use this if you need to cache expensive stats computes separately
	 * to prevent recompute on remounting.
	 */
	metadata?: TableMetadata
	offset?: number
	limit?: number
	/**
	 * Indicates whether we should include all of the columns in the table by default.
	 * If false, a columns array must be provided.
	 */
	includeAllColumns?: boolean
	/**
	 * List of visible columns selected from the table.
	 * If ommitted all configured columns are shown by default.
	 */
	visibleColumns?: string[]
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
	 * Passthrough to the group header rendering, when using the group by verb
	 */
	onRenderGroupHeader?: GroupHeaderFunction
	/**
	 * Key for a selected column - this is not normally an option in DetailsList
	 */
	selectedColumn?: string
	/**
	 * Fixed headers on top when scrolling
	 */
	isHeadersFixed?: boolean
}
