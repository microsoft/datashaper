/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field, SortDirection, ValidationResult } from '@datashaper/schema'
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
import type { CSSProperties } from 'react'

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
	field?: Field,
	columnName?: string,
	props?: IDetailsGroupDividerProps | undefined,
) => any

export type SaveMetadataFunction = (
	metadata: TableMetadata,
	table: ColumnTable,
) => void

export type ColumnSelectFunction = (
	evt?: React.MouseEvent<HTMLElement>,
	column?: IColumn | undefined,
) => void

/**
 * Available column statistics to show in the Arquero Details List
 */
export enum StatsColumnType {
	Type = 'type',
	Count = 'count',
	Distinct = 'distinct',
	Invalid = 'invalid',
	Mode = 'mode',
	Min = 'minimum',
	Max = 'maximum',
	Mean = 'mean',
	Median = 'median',
	Stdev = 'stdev',
	Example = 'example',
}

/**
 * Feature flags and configuration for the Arquero Details List component
 */
export interface ArqueroDetailsListFeatures {
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
	/**
	 * Option to hide the default row number, which is the first column with a detail styling. Default as false
	 */
	hideRowNumber?: boolean
}

/**
 * Props for the Arquero Details List component
 */
export interface ArqueroDetailsListProps
	extends Omit<IDetailsListProps, 'items'> {
	table: ColumnTable
	validationResult?: ValidationResult
	features?: ArqueroDetailsListFeatures
	/**
	 * Optional metadata to use for column smart features.
	 * Use this if you need to cache expensive stats computes separately
	 * to prevent recompute on remounting.
	 */
	metadata?: TableMetadata
	fields?: Field[]
	offset?: number
	limit?: number
	sortable?: boolean
	/**
	 * Indicates whether to use even/odd row coloring.
	 */
	striped?: boolean
	/**
	 * Indicates to use borders between columns so the cells look more like a spreadsheet (row borders are always on).
	 */
	showColumnBorders?: boolean
	/**
	 * Indicates that the table should fill its container space,
	 * including the use of pseudo columns and rows to present a "spreadsheet-like" view.
	 */
	fill?: boolean
	/**
	 * Fires a column-wide select event for all columns, including headers.
	 * If you need custom behavior, use the built-in table-level onColumnHeaderClick and per-column onClick
	 */
	onColumnSelect?: ColumnSelectFunction
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
	isHeaderFixed?: boolean
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
	/**
	 * If compact = true, override the default height.
	 * FluentUI hard-codes the compact height, so this gives us a way to customize how dense the rows are.
	 * Note that if compact = false (the default), this has no effect.
	 */
	compactRowHeight?: number
	/**
	 * Style to pass to the container.
	 * Use the regular DetailsList.styles prop for deeper customization of the table itself.
	 */
	style?: CSSProperties
}
