/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TypeHints } from '@datashaper/schema'
import isArrayLd from 'lodash-es/isArray.js'
import isFinite from 'lodash-es/isFinite.js'
import isPlainObject from 'lodash-es/isPlainObject.js'
import toNumber from 'lodash-es/toNumber.js'
import moment from 'moment'

import {
	decimalDefault,
	falseDefaults,
	naDefaults,
	thousandsDefault,
	trueDefaults,
} from './defaults.js'
import { formatNumberStr, getDate } from './util.js'

export function validator(options?: TypeHints): any {
	return {
		isNull: isNull(options?.naValues),
		isBoolean: isBoolean(options?.trueValues, options?.falseValues),
		isNumber: isNumber(options?.decimal, options?.thousands),
		isArray,
		isObject,
		isDate,
	}
}

export function isNull(naValues = naDefaults): (value: string) => boolean {
	const naValuesSet = new Set(naValues)
	return function (value: string) {
		return naValuesSet.has(value)
	}
}

export function isBoolean(
	falseValues = falseDefaults,
	trueValues = trueDefaults,
): (value: string) => boolean {
	const booleanSet = new Set(
		[...falseValues, ...trueValues].map(v => v.toLowerCase()),
	)
	return function (value: string) {
		const str = value.toLowerCase()
		return booleanSet.has(str)
	}
}

export function isNumber(
	decimal = decimalDefault,
	thousands = thousandsDefault,
): (value: string) => boolean {
	return function (value: string) {
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
	return moment(getDate(value)).isValid()
}
