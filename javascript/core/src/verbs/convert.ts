/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType,determineType } from '@essex/arquero'
import { escape, op } from 'arquero'
import { isoParse, timeFormat, timeParse } from 'd3-time-format'

import type { InputColumnListArgs } from './types.js'
import { ParseType } from './types.js'
import { bool } from './util/data-types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

export interface ConvertArgs extends InputColumnListArgs {
	type: ParseType
	/**
	 * Optional radix to use for parsing strings into ints
	 */
	radix?: number

	formatPattern?: string
}

/**
 * Executes an arquero string parse operation.
 */
export const convertStep: ColumnTableStep<ConvertArgs> = (
	input,
	{ columns, type, radix, formatPattern },
) => {
	// note that this applies the specified parse to every column equally
	const dArgs = columns.reduce((acc, cur) => {
		acc[cur] = parseType(cur, type, radix, formatPattern)
		return acc
	}, {} as any)
	return input.derive(dArgs)
}

function parseType(
	column: string,
	type: ParseType,
	radix?: number,
	formatPattern?: string,
) {
	const parseTime = timeParse(formatPattern ?? '%Y-%m-%d')
	const formatTime = timeFormat(formatPattern ?? '%Y-%m-%d')

	return escape((d: any) => {
		const value = d[column]
		switch (type) {
			case ParseType.Boolean:
				// arquero has no boolean operation
				return bool(value)
			case ParseType.Date: {
				if (value !== null && !isNaN(value)) return new Date(value)

				return formatPattern === '%Y-%m-%dT%H:%M:%S.%LZ'
					? isoParse(value)
					: parseTime(value)
			}
			case ParseType.Integer:
				return op.parse_int(value, radix)
			case ParseType.Decimal:
				return op.parse_float(value)
			case ParseType.String: {
				if (
					determineType(value) === DataType.String &&
					value.trim().toLowerCase() === 'undefined'
				)
					return undefined

				if (
					determineType(value) === DataType.String &&
					value.trim().toLowerCase() === 'null'
				)
					return null

				if (value instanceof Date) return formatTime(value)

				return value !== undefined && value !== null ? value.toString() : value
			}
		}
	})
}

export const convert = stepVerbFactory(convertStep)
