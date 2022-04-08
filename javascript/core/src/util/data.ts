/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import isArray from 'lodash-es/isArray.js'
import isDate from 'lodash-es/isDate.js'
import isNaN from 'lodash-es/isNaN.js'
import isNil from 'lodash-es/isNil.js'

import type { Value } from '../tables/types.js'
import { DataType } from '../verbs/types.js'

/**
 * Guess the type of a table value with more discernment than typeof
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 * @param value -
 * @returns
 */
export function determineType(value: Value): DataType {
	if (isNil(value)) {
		return DataType.Unknown
	}
	if (isNaN(value)) {
		return DataType.Number
	}
	const type = typeof value as string
	if (type === 'object') {
		if (isDate(value)) {
			return DataType.Date
		} else if (isArray(value)) {
			return DataType.Array
		}
	}
	return type as DataType
}

/**
 * Ensure an incoming value matches its datatype.
 * For example, if user input is from a textfield, parse it.
 * @param value -
 * @param dataType -
 */
export function coerce(value: Value, dataType: DataType): Value {
	switch (dataType) {
		case DataType.Number:
			return Number.parseFloat(value)
		case DataType.Date:
			return new Date(value)
		case DataType.Boolean:
			return !!value
		default:
			return value
	}
}

/**
 * Returns a nice formatted string for a number
 * @param value -
 * @param options -
 */
export function format(
	value: number,
	options?: { minExp?: number; precision?: number },
): string {
	if (value === 0) {
		return '0'
	}
	const { minExp = 5, precision = 2 } = options || {}
	const getExp = (value: number, exp = 0): number =>
		value % 10 === 0 ? getExp(value / 10, exp + 1) : exp
	let exp
	let mantissa
	if (Number.isInteger(value)) {
		exp = getExp(value)
		if (!Number.isInteger(exp) || exp === 0 || exp <= minExp) {
			return value + ''
		}
	} else {
		exp = Math.floor(Math.log10(value))
		mantissa = value / Math.pow(10, exp)
		if (Math.abs(exp) <= minExp || !Number.isInteger(mantissa)) {
			const fixed = value.toFixed(precision)
			const parsed = Number.parseFloat(fixed)
			return parsed + ''
		}
	}

	mantissa = value / Math.pow(10, exp)
	return `${mantissa}e${exp}`
}

/**
 * Returns a formatted string for a number, otherwise returns the original value
 * @param value -
 */
export function formatIfNumber(value: Value): string | Value {
	if (typeof value === 'number') {
		return format(value)
	}
	if (typeof value === 'string') {
		const parsed = Number.parseFloat(value)
		if (Number.isFinite(parsed)) {
			return format(parsed)
		}
	}
	return value
}
