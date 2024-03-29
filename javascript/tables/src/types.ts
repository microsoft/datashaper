/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, FieldMetadata } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface TableContainer<T = unknown> {
	/**
	 * This is the formal id for a table, and must be unique within the store.
	 * A URI would normally be appropriate.
	 */
	id: string
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

export interface TableMetadata {
	rows: number
	cols: number
	/**
	 * Metadata for each column
	 */
	columns: Record<string, FieldMetadata>
}

export interface ReadTableOptions {
	/**
	 * If a codebook is supplied, we'll use this for type casting.
	 */
	codebook?: CodebookSchema
	/**
	 * If true, we'll try to auto-detect the type of each column.
	 * This is ignored if a codebook is supplied.
	 */
	autoType?: boolean
	/**
	 * If autoType is true, we'll limit the rows we check to this number to avoid scanning the entire table.
	 * This is ignored if a codebook is supplied.
	 */
	autoMax?: number
}
