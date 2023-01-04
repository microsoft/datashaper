/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TypeHints} from '@datashaper/schema';
import { DataType,TypeHintsDefaults  } from '@datashaper/schema'
import isArrayLd from 'lodash-es/isArray.js'
import isFinite from 'lodash-es/isFinite.js'
import isPlainObject from 'lodash-es/isPlainObject.js'
import toNumber from 'lodash-es/toNumber.js'
import moment from 'moment'

import { formatNumberStr, getDate } from './util.js'

/**
 * Factory function to provide a type guessing function for any string value.
 * This uses optional type hints to account for string values such as boolean and null formats.
 * @param options - The type hinting options
 * @returns A function that evaluates the datatype of inputs
 */
export function guessDataType(
	options?: TypeHints,
): (value: string) => DataType {
	const { isNull, isBoolean, isNumber, isArray, isObject, isDate } =
		typeGuesserFactory(options)
	return function (value: string) {
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
		if (isArray(value)) {
			return DataType.Array
		}
		if (isObject(value)) {
			return DataType.Object
		}
		if (value === DataType.Undefined) {
			return DataType.Undefined
		}
		return DataType.String
	}
}

export function typeGuesserFactory(options?: TypeHints): any {
	return {
		isNull: isNull(options?.naValues),
		isBoolean: isBoolean(options?.trueValues, options?.falseValues),
		isNumber: isNumber(options?.decimal, options?.thousands),
		isArray,
		isObject,
		isDate,
	}
}

export function isNull(
	naValues = TypeHintsDefaults.naValues,
): (value: string) => boolean {
	const naValuesSet = new Set(naValues)
	return function (value: string) {
		if (value === null) return true

		return naValuesSet.has(value)
	}
}

export function isBoolean(
	falseValues = TypeHintsDefaults.falseValues,
	trueValues = TypeHintsDefaults.trueValues,
): (value: string) => boolean {
	const booleanSet = new Set(
		[...falseValues, ...trueValues].map(v => v.toLowerCase()),
	)
	return function (value: string) {
		if (value === null) return false

		const str = value.toLowerCase()
		return booleanSet.has(str)
	}
}

export function isNumber(
	decimal = TypeHintsDefaults.decimal,
	thousands = TypeHintsDefaults.thousands,
): (value: string) => boolean {
	return function (value: string) {
		if (value === null) return false

		const n = formatNumberStr(value, decimal, thousands)
		return isFinite(toNumber(n))
	}
}

export function isArray(value: string): boolean {
	try {
		const array = JSON.parse(value)
		return isArrayLd(array)
	} catch {
		return false
	}
}

export function isObject(value: string): boolean {
	try {
		const object = JSON.parse(value)
		return isPlainObject(object)
	} catch {
		return false
	}
}

export function isDate(value: string): boolean {
	if (value === null) return false

	return moment(getDate(value)).isValid()
}
