/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { DataType } from '../types/enums.js'

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

export interface TableContainer<T = unknown> {
	/**
	 * This is the formal id for a table, and must be unique within the store.
	 * A URI would normally be appropriate.
	 */
	id: string
	/**
	 * This is an optional alias or friendly name for the table.
	 */
	name?: string
	/**
	 * This is the actual Arquero table instance to store.
	 * If it has not been resolved yet it will be undefined.
	 */
	table?: ColumnTable
	/**
	 * Optional metadata block for the table.
	 * This can follow the container around to help avoid recomputes.
	 */
	metadata?: TableMetadata
	/**
	 * Optional contextual data about the table.
	 * For example, if the table was created using a process/transformation
	 * that has additional information to relay, that context can be stored here.
	 */
	context?: T
}
