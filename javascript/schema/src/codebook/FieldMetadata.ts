/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DataType } from '../data.js'

/**
 * Holds core metadata/stats for a data field.
 */
export interface FieldMetadata {
	/**
	 * TEMP: this is determined via stats introspection, but our much more
	 * robust type discovery for the codebooks should be used, and the type on Field.
	 */
	type?: DataType
	/**
	 * Count of valid values in the column (excluding invalid, null, etc.)
	 */
	count?: number
	/**
	 * Count of unique values in the column
	 */
	distinct?: number
	/**
	 * Count of invalid/null values in the column
	 */
	invalid?: number
	/**
	 * Mode
	 */
	mode?: string | number | boolean | Date
	/**
	 * Min value.
	 * Note that this can be specified rather than computed, in which case it defines valid boundaries for the data values.
	 */
	minimum?: number
	/**
	 * Max value.
	 * Note that this can be specified rather than computed, in which case it defines valid boundaries for the data values.
	 */
	maximum?: number
	/**
	 * Magnitude of the data, i.e., the absolute difference between the min and max values.
	 */
	magnitude?: number
	/**
	 * Mean.
	 */
	mean?: number
	/**
	 * Median.
	 */
	median?: number
	/**
	 * Standard deviation.
	 */
	stdev?: number
	/**
	 * Computed histogram bins for numeric fields.
	 */
	bins?: Bin[]
	/**
	 * List of unique categories for string fields.
	 */
	categories?: Category[]
}

/**
 * Describes a data bin in terms of inclusive lower bound and count of values in the bin.
 */
export interface Bin {
	min: number | string
	count: number
}

/**
 * Describes a nominal category in terms of category name and count of values in the category.
 */
export interface Category {
	name: string
	count: number
}
