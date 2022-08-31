/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Validation constraints for a field.
 */
export interface Constraints {
	/**
	 * Indicates that this field is required (not nullable).
	 */
	required?: boolean
	/**
	 * Indicates that every value in this column must be unique.
	 */
	unique?: boolean
	/**
	 * For strings or arrays, this is the minimum allowed length of values.
	 */
	minLength?: number
	/**
	 * For strings or arrays, this is the maximum allowed length of values.
	 */
	maxLength?: number
	/**
	 * For numbers or dates, this is the minimum allowed value.
	 */
	minimum?: number
	/**
	 * For numbers or dates, this is the maximum allowed value.
	 */
	maximum?: number
	/**
	 * RegExp pattern that string values must match.
	 */
	pattern?: string
	/**
	 * Strict list of allowed values in the column.
	 */
	enum?: string[]
}
