/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { format } from 'd3-format'
import isNil from 'lodash-es/isNil.js'

/**
 * A no-op utility functionw
 */
export const noop = (): void => {
	/* do nothing */
}

/**
 * A utility identity function
 */
export const identity = <T>(value?: T): T | undefined => value

/**
 * Converts a string value to a numeric
 * @param value The string value
 * @returns The string cast as a number (if defined)
 */
export const num = (value?: string): number | undefined => {
	if (value) {
		return +value
	}
}

/**
 * Creates a callback that returns a static value
 * @param value The value to prime the function with
 * @returns A callback that returns the given value
 */
export const staticCallback =
	<T>(value: T) =>
	(): T =>
		value

export function formatNumber(
	value: number | undefined,
	formatter: string | undefined,
): string {
	if (isNil(value)) {
		return ''
	}
	if (formatter) {
		const f = format(formatter)
		return f(value)
	}
	return value.toString()
}

export function sliceTable(
	table: ColumnTable,
	offset: number,
	limit: number,
): ColumnTable {
	if (offset === 0 && limit === Infinity) {
		return table
	}
	return table.slice(offset, offset + limit)
}
