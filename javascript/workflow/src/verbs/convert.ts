/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConvertArgs } from '@datashaper/schema'
import { DataType, ParseType } from '@datashaper/schema'
import { determineType } from '@datashaper/tables'
import { escape, op } from 'arquero'
import { isoParse, timeFormat, timeParse } from 'd3-time-format'

import { bool } from './util/data-types.js'
import type { ColumnTableStep } from './util/factories.js'
import { stepVerbFactory } from './util/factories.js'

/**
 * Executes an arquero string parse operation.
 */
export const convertStep: ColumnTableStep<ConvertArgs> = (
	input,
	{ column, type, radix, delimiter, to, formatPattern },
) => {
	const dArgs = {
		[to]: parseType(column, type, radix, delimiter, formatPattern),
	}

	// note that this applies the specified parse to every column equally
	return input.derive(dArgs)
}

function parseType(
	column: string,
	type: ParseType,
	radix?: number,
	delimiter?: string,
	formatPattern?: string,
) {
	const parseTime = timeParse(formatPattern ?? '%Y-%m-%d')
	const formatTime = timeFormat(formatPattern ?? '%Y-%m-%d')

	return escape((d: any) => {
		const value = d[column]
		const inputType = determineType(value)
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
				return parseInteger(value, radix)
			case ParseType.Decimal:
				return parseDecimal(value)
			case ParseType.Array:
				return op.split(value, delimiter, 10000000)
			case ParseType.String: {
				if (
					inputType === DataType.String &&
					value.trim().toLowerCase() === 'undefined'
				)
					return undefined

				if (
					inputType === DataType.String &&
					value.trim().toLowerCase() === 'null'
				)
					return null

				if (value instanceof Date) return formatTime(value)

				if (inputType === DataType.Array) return op.join(value, delimiter)

				return value !== undefined && value !== null ? value.toString() : value
			}
		}
	})
}

function parseInteger(value: any, radix?: number): number | null {
	const val = op.parse_int(value, radix)
	return isNaN(val) ? null : val
}

function parseDecimal(value: any): number | null {
	const val = op.parse_float(value)
	return isNaN(val) ? null : val
}

export const convert = stepVerbFactory(convertStep)
