/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TypeHints, Value } from '@datashaper/schema'
import { DataType, TypeHintsDefaults } from '@datashaper/schema'
import toNumber from 'lodash-es/toNumber.js'
import moment from 'moment'
import isTypedArray from 'lodash-es/isTypedArray.js'
import { guessDataType, typeGuesserFactory } from './guessDataType.js'
import { formatNumberStr, getDate } from './util.js'

/**
 * Factory function to create a value parser based on defined data type and type hints
 * @param type - the datatype to interperet as
 * @param subtype - the subtype of the datatype (i.e., if the main type is an array)
 * @param hints - type hinting information
 * @returns A parsed value
 */
export function parseAs(
	type?: DataType,
	subtype?: DataType,
	hints?: TypeHints,
): Value {
	switch (type) {
		// TODO: differentiate integer and decimal (if type is integer and it has decimals, it should return null)
		case DataType.Integer:
		case DataType.Number:
			return parseNumber(hints?.naValues, hints?.decimal, hints?.thousands)
		case DataType.Boolean:
			return parseBoolean(
				hints?.naValues,
				hints?.trueValues,
				hints?.falseValues,
			)
		case DataType.Array:
			return parseArray(subtype, hints)
		case DataType.Object:
			return parseObject(hints)
		case DataType.Date:
			return parseDate(hints?.naValues)
		case DataType.Undefined:
			return parseUndefined(hints?.naValues)
		case DataType.String:
			return parseString(hints?.naValues)
		default:
			return parseString(hints?.naValues)
	}
}

export function parseNumber(
	naValues = TypeHintsDefaults.naValues,
	decimal = TypeHintsDefaults.decimal,
	thousands = TypeHintsDefaults.thousands,
): (values: string) => number | null {
	const { isNull } = typeGuesserFactory({ naValues })
	return function parseNumber(value: string) {
		if (isNull(value)) {
			return null
		}
		if (typeof value === 'number') {
			return value as number
		}

		const formatted = formatNumberStr(value, { decimal, thousands })
		const num = toNumber(formatted)
		return num
	}
}

export function parseBoolean(
	naValues = TypeHintsDefaults.naValues,
	trueValues = TypeHintsDefaults.trueValues,
	falseValues = TypeHintsDefaults.falseValues,
): (value: string) => boolean | null {
	const { isNull } = typeGuesserFactory({ naValues })
	const trueSet = new Set(trueValues.map((v) => v.toLowerCase()))
	const falseSet = new Set(falseValues.map((v) => v.toLowerCase()))
	return function parseBoolean(value: string) {
		if (isNull(value)) {
			return null
		}
		if (typeof value === 'boolean') {
			return value as boolean
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
	naValues = TypeHintsDefaults.naValues,
): (value: string) => string | null {
	const { isNull } = typeGuesserFactory({ naValues })
	return function parseString(value: string) {
		if (isNull(value)) {
			return null
		}
		return value
	}
}

export function parseArray(
	subtype = DataType.String,
	options?: TypeHints,
	delimiter = ',',
): (value: unknown) => any[] | null {
	const { isNull } = typeGuesserFactory(options)
	return function parseArray(value: unknown) {
		if (isNull(value)) {
			return null
		}
		if (Array.isArray(value) || isTypedArray(value)) {
			return value as any[]
		}

		// NOTE: Array.isArray won't return true on typed arrays (e.g. Float64Array)
		// We could check for each typed array type, but that's a lot of cases.
		// Instead, we'll just check to see if this is a string, and if so, parse the array out.
		if (typeof value === 'string') {
			const array = value.split(delimiter)
			try {
				const parsed = array.map((i) => {
					const item = `${i}`
					const parser = parseAs(subtype, subtype, options)
					return parser(item)
				})
				return parsed
			} catch {
				return array
			}
		}
		throw new Error(`could not parse array value ${value}`)
	}
}

export function parseObject(
	options?: TypeHints,
): (value: string) => object | null {
	const { isNull } = typeGuesserFactory(options)
	const subTypeChecker = guessDataType(options)
	return function parseObject(value: string) {
		if (isNull(value)) {
			return null
		}
		const obj = JSON.parse(value)
		try {
			const parsed = Object.keys(obj).reduce(
				(acc: Record<string, any>, key: string) => {
					const item = `${obj[key]}`
					// for objects we'll just do our best with property types - we don't support detailed subobject structures right now
					const type = subTypeChecker(item)
					const parser = parseAs(type, type, options)
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
	naValues = TypeHintsDefaults.naValues,
): (value: string) => Date | null {
	const { isNull } = typeGuesserFactory({ naValues })
	return function parseDate(value: string) {
		if (isNull(value)) {
			return null
		}
		return moment(getDate(value)).toDate()
	}
}

export function parseUndefined(
	naValues = TypeHintsDefaults.naValues,
): (value: string) => undefined | null {
	const { isNull } = typeGuesserFactory({ naValues })
	return function parseUndefined(value: string) {
		if (isNull(value)) {
			return null
		}
		return undefined
	}
}
