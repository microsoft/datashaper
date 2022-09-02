/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'

import { guessDataType } from './guessDataType.js'

export function guessDataTypeByColumn(columnValues: string[]): DataType {
	const defaultTypeHints = {
		delimiter: delimiterDefault,
		trueValues: trueDefaults,
		falseValues: falseDefaults,
		naValues: naDefaults,
		dateFormat: dateFormatDefault,
		thousands: thousandsDefault,
		decimal: decimalDefault,
		comment: commentDefault,
	}

	const guesser = guessDataType(defaultTypeHints)

	const mapTypes = new Map()

	columnValues.forEach(value => {
		const dataTypeResult = guesser(value)

		if (dataTypeResult !== DataType.Null && !mapTypes.has(dataTypeResult)) {
			mapTypes.set(dataTypeResult, true)
		} else if (dataTypeResult === DataType.Null && mapTypes.size === 0) {
			mapTypes.set(dataTypeResult, true)
		} else if (
			dataTypeResult !== DataType.Null &&
			mapTypes.has(DataType.Null)
		) {
			mapTypes.delete(DataType.Null)
			mapTypes.set(dataTypeResult, true)
		}
	})

	if (mapTypes.size === 1) {
		for (const key of mapTypes.keys()) {
			return key
		}
	}

	return DataType.String
}

export const naDefaults = [
	'-1.#IND',
	'1.#QNAN',
	'1.#IND',
	'-1.#QNAN',
	'#N/A N/A',
	'#N/A',
	'N/A',
	'n/a',
	'NA',
	'<NA>',
	'#NA',
	'NULL',
	'null',
	'NaN',
	'-NaN',
	'nan',
	'-nan',
	'',
]

export const trueDefaults = ['true']

export const falseDefaults = ['false']

export const decimalDefault = '.'

export const thousandsDefault = ','

export const commentDefault = '#'

export const delimiterDefault = ','

export const dateFormatDefault = 'YYYY-MM-DD'
