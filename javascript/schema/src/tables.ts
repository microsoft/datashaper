/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Bin, Category } from './codebook/FieldMetadata.js'
import type { DataType } from './data.js'

/**
 * A cell value in Arquero
 */

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
