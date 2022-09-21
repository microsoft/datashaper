/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field, SortDirection } from '@datashaper/schema'
import type { TableMetadata } from '@datashaper/tables'
import type {
	IColumn,
	IDetailsColumnProps,
	IDetailsGroupDividerProps,
	IDetailsListProps,
	IDropdownOption,
	IRenderFunction,
} from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table'

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
	meta?: Field,
	columnName?: string,
	props?: IDetailsGroupDividerProps | undefined,
) => any

export type SaveMetadataFunction = (
	meta: TableMetadata,
	table: ColumnTable,
) => void

export type ColumnClickFunction = (
	evt?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
	column?: IColumn | undefined,
) => void

export type MetadataClickFunction = (
	evt?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
	column?: IColumn | undefined,
	metadata?: Field,
) => void

export enum StatsColumnType {
	Type = 'type',
	Count = 'count',
	Distinct = 'distinct',
	Invalid = 'invalid',
	Mode = 'mode',
	Min = 'min',
	Max = 'max',
	Mean = 'mean',
	Median = 'median',
	Stdev = 'stdev',
}

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
	 * If histogramColumnHeaders is true the user can pass a custom function to the click event
	 */
	onHistogramColumnHeaderClick?: MetadataClickFunction
	/**
	 * Include stats in the headers of columns.
	 */
	statsColumnHeaders?: boolean
	/**
	 * If statsColumnHeaders is true the user can pass a custom function to the click event
	 */
	onStatsColumnHeaderClick?: MetadataClickFunction
	/**
	 * If statsColumnHeaders or smartHeaders is true the user can pass which stats he wants
	 */
	statsColumnTypes?: StatsColumnType[]
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

	/**
	 * Receive elements to render in the column header as commands, passing the column details to be used in the component
	 */
	commandBar?: IRenderFunction<IDetailsColumnProps>[]
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
	sortable?: boolean
	/**
	 * Indicates whether to use even/odd row coloring.
	 */
	striped?: boolean
	/**
	 * Indicates that the entire column is clickable for selection.
	 */
	clickableColumns?: boolean
	/**
	 * Indicates to use borders between columns so the cells look more like a spreadsheet (row borders are always on).
	 */
	showColumnBorders?: boolean
	/**
	 * Passthrough to the column click handler.
	 * Will be applied to the column header only unless clickableColumns === true.
	 * Note that if the entire column is not clickable, this is duplicative of the built-in onColumnHeaderClick
	 * and they will both fire.
	 * TODO: maybe turn this into onColumnSelect?
	 */
	onColumnClick?: ColumnClickFunction
	/**
	 * If array cells are displayed with a dropdown, this will fire when a value is selected.
	 */
	onCellDropdownSelect?: DropdownOptionSelect
	/**
	 * Passthrough to the group header rendering, when using the group by verb
	 */
	onRenderGroupHeader?: GroupHeaderFunction
	/**
	 * Fixed headers on top when scrolling
	 */
	isHeadersFixed?: boolean
	/**
	 * Resizable columns
	 */
	resizable?: boolean
	/**
	 * Key for a selected column - this is not normally an option in DetailsList
	 */
	selectedColumn?: string
	/**
	 * Default sort column
	 */
	defaultSortColumn?: string
	/**
	 * Resizable sort direction
	 */
	defaultSortDirection?: SortDirection
}
