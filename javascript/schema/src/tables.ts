/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum DataType {
	Array = 'array',
	Boolean = 'boolean',
	Date = 'date',
	Number = 'number',
	String = 'string',
	Text = 'text',
	Object = 'object',
	Undefined = 'undefined',
	Unknown = 'unknown',
}

/**
 * A cell value in Arquero
 */
export type Value = any

export interface ColumnStats {
	type: DataType
	count: number
	distinct: number
	invalid: number
	mode: any
	min?: number
	max?: number
	mean?: number
	median?: number
	stdev?: number
	bins?: Bin[]
	categories?: Category[]
}

export interface Bin {
	min: number | string
	count: number
}

export interface Category {
	name: string
	count: number
}

/**
 * Stores basic meta and stats about a column
 */
export interface ColumnMetadata {
	name: string
	type: DataType
	stats?: ColumnStats
}

export interface TableMetadata {
	rows: number
	cols: number
	/**
	 * Metadata for each column
	 */
	columns: Record<string, ColumnMetadata>
}

export enum SortDirection {
	Ascending = 'asc',
	Descending = 'desc',
}
