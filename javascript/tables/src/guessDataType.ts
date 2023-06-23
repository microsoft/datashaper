/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	DataType,
	TypeHintsDefaults,
	DataFormat,
	type TypeHints,
} from '@datashaper/schema'
import isFinite from 'lodash-es/isFinite.js'
import isPlainObject from 'lodash-es/isPlainObject.js'
import toNumber from 'lodash-es/toNumber.js'
import moment from 'moment'
import isTypedArray from 'lodash-es/isTypedArray.js'

import { formatNumberStr, getDate } from './util.js'
/**
 * Factory function to provide a type guessing function for any string value.
 * This uses optional type hints to account for string values such as boolean and null formats.
 * @param options - The type hinting options
 * @returns A function that evaluates the datatype of inputs
 */
export function guessDataType(
	options?: TypeHints,
): (value: unknown) => DataType {
	const { isNull, isBoolean, isNumber, isArray, isObject, isDate } =
		typeGuesserFactory(options)
	return function (value: unknown) {
		if (isNull(value)) {
			return DataType.Null
		}
		if (isNumber(value)) {
			return DataType.Number
		}
		if (isBoolean(value)) {
			return DataType.Boolean
		}
		if (isDate(value)) {
			return DataType.Date
		}
		if (isObject(value)) {
			return DataType.Object
		}
		if (isArray(value)) {
			return DataType.Array
		}
		if (value === DataType.Undefined) {
			return DataType.Undefined
		}
		return DataType.String
	}
}

export function typeGuesserFactory(options?: TypeHints): {
	isNull: (value: unknown) => boolean
	isBoolean: (value: unknown) => boolean
	isNumber: (value: unknown) => boolean
	isArray: (value: unknown) => boolean
	isObject: (value: unknown) => boolean
	isDate: (value: unknown) => boolean
} {
	return {
		isNull: isNull(options?.naValues),
		isBoolean: isBoolean(options?.trueValues, options?.falseValues),
		isNumber: isNumber(options?.decimal, options?.thousands),
		isArray: isArray(
			options?.arrayDelimiter ?? ',',
			options?.dataFormat ?? DataFormat.CSV,
		),
		isObject,
		isDate,
	}
}

export function isNull(
	naValues = TypeHintsDefaults.naValues,
): (value: unknown) => boolean {
	const naValuesSet = new Set<unknown>(naValues)
	return function (value: unknown) {
		if (value === null) return true

		return naValuesSet.has(value)
	}
}

export function isBoolean(
	falseValues = TypeHintsDefaults.falseValues,
	trueValues = TypeHintsDefaults.trueValues,
): (value: unknown) => boolean {
	const booleanSet = new Set(
		[...falseValues, ...trueValues].map((v) => v.toLowerCase()),
	)
	return function (value: unknown) {
		if (value === null) return false
		if (typeof value === 'boolean') return true
		if (typeof value === 'string') {
			const str = value.toLowerCase()
			return booleanSet.has(str)
		}
		return false
	}
}

export function isNumber(
	decimal = TypeHintsDefaults.decimal,
	thousands = TypeHintsDefaults.thousands,
): (value: unknown) => boolean {
	return function (value: unknown) {
		if (typeof value === 'string' || typeof value === 'number') {
			const n = formatNumberStr(value, { decimal, thousands })
			const result = n === '' ? false : isFinite(toNumber(n))
			return result
		}
		return false
	}
}

/**
 * Detect if a string is an array by looking for the delimiter.
 * It's expected that in a CSV any array cells will be quoted.
 * Also note that if the default delimiter, comma, is used, these may be detected as valid numbers if checked first.
 */
export function isArray(
	delimiter: string,
	format: DataFormat,
): (value: unknown) => boolean {
	const reg = new RegExp(`${delimiter}`)
	return (value: unknown) => {
		if (Array.isArray(value) || isTypedArray(value)) {
			return true
		} else if (typeof value === 'string' && format === DataFormat.CSV) {
			// only use array inference on CSV source files
			return reg.test(value)
		} else {
			return false
		}
	}
}

export function isObject(value: unknown): boolean {
	try {
		if (
			typeof value !== 'string' &&
			typeof value !== 'number' &&
			typeof value !== 'boolean' &&
			!Array.isArray(value) &&
			!isTypedArray(value) &&
			isPlainObject(value)
		) {
			return true
		} else if (typeof value === 'string') {
			const object = JSON.parse(value)
			return isPlainObject(object)
		}
		return false
	} catch {
		return false
	}
}

export function isDate(value: unknown): boolean {
	if (value === null) return false

	if (value instanceof Date) {
		return true
	} else if (typeof value === 'string') {
		return moment(getDate(value)).isValid()
	}
	return false
}
