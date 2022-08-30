/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TypeHints } from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import toNumber from 'lodash-es/toNumber.js'
import moment from 'moment'

import {
	dateFormatDefault,
	decimalDefault,
	falseDefaults,
	naDefaults,
	thousandsDefault,
	trueDefaults,
} from './defaults.js'
import { guessType } from './guess-type.js'
import { formatNumberStr, getDate } from './util.js'
import { validator } from './validators.js'

export function parseAs(type?: DataType, options?: TypeHints): any {
	switch (type) {
		case DataType.Number:
			return parseNumber(
				options?.naValues,
				options?.decimal,
				options?.thousands,
			)
		case DataType.Boolean:
			return parseBoolean(
				options?.naValues,
				options?.trueValues,
				options?.falseValues,
			)
		case DataType.Array:
			return parseArray(options)
		case DataType.Object:
			return parseObject(options)
		case DataType.Date:
			return parseDate(options?.naValues, options?.dateFormat)
		case DataType.Undefined:
			return parseUndefined(options?.naValues)
		case DataType.Null:
		default:
			return parseString(options?.naValues)
	}
}

export function parseNumber(
	naValues = naDefaults,
	decimal = decimalDefault,
	thousands = thousandsDefault,
): (values: string) => number | null {
	const { isNull } = validator({ naValues })
	return function parseNumber(value: string) {
		if (isNull(value)) {
			return null
		}
		return toNumber(formatNumberStr(value, decimal, thousands))
	}
}

export function parseBoolean(
	naValues = naDefaults,
	trueValues = trueDefaults,
	falseValues = falseDefaults,
): (value: string) => boolean | null {
	const { isNull } = validator({ naValues })
	const trueSet = new Set(trueValues.map(v => v.toLowerCase()))
	const falseSet = new Set(falseValues.map(v => v.toLowerCase()))
	return function parseBoolean(value: string) {
		if (isNull(value)) {
			return null
		}
		const str = value.toLowerCase()
		if (trueSet.has(str)) {
			return true
		}
		if (falseSet.has(str)) {
			return false
		}
		return null
	}
}

export function parseString(
	naValues = naDefaults,
): (value: string) => string | null {
	const { isNull } = validator({ naValues })
	return function parseString(value: string) {
		if (isNull(value)) {
			return null
		}
		return value
	}
}

export function parseArray(
	options?: TypeHints,
): (value: string) => any[] | null {
	const { isNull } = validator(options)
	const typeGuesser = guessType(options)
	return function parseArray(value: string) {
		if (isNull(value)) {
			return null
		}
		const array = JSON.parse(value) as any[]
		try {
			const parsed = array.map(i => {
				const item = `${i}`
				const type = typeGuesser(item)
				const parser = parseAs(type, options)
				return parser(item)
			})
			return parsed
		} catch {
			return array
		}
	}
}

export function parseObject(
	options?: TypeHints,
): (value: string) => object | null {
	const { isNull } = validator(options)
	const typeGuesser = guessType(options)
	return function parseObject(value: string) {
		if (isNull(value)) {
			return null
		}
		const obj = JSON.parse(value)
		try {
			const parsed = Object.keys(obj).reduce(
				(acc: Record<string, any>, key: string) => {
					const item = `${obj[key]}`
					const type = typeGuesser(item)
					const parser = parseAs(type, options)
					acc[key] = parser(item)
					return acc
				},
				{},
			)
			return parsed
		} catch {
			return obj
		}
	}
}

export function parseDate(
	naValues = naDefaults,
	dateFormat = dateFormatDefault,
): (value: string) => string | null {
	const { isNull } = validator({ naValues })
	return function parseDate(value: string) {
		if (isNull(value)) {
			return null
		}
		return moment(getDate(value)).format(dateFormat)
	}
}

export function parseUndefined(
	naValues = naDefaults,
): (value: string) => undefined | null {
	const { isNull } = validator({ naValues })
	return function parseUndefined(value: string) {
		if (isNull(value)) {
			return null
		}
		return undefined
	}
}
