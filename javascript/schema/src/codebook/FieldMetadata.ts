/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface FieldMetadata {
	/**
	 * Count of valid values in the column (excluding invalid, null, etc.)
	 */
	count: number
	/**
	 * Count of unique values in the column
	 */
	distinct: number
	/**
	 * Count of invalid/null values in the column
	 */
	invalid: number
	/**
	 * Mode
	 */
	mode?: any
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
	// TODO: bins and categories are pre-computed for convenience, but do they belong here specifically?
	// categories, for example, can be present in the data dictionary, the Category interface just captures it with counts
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
