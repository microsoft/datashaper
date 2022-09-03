/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'

import { guessDataType } from './guessDataType.js'

export function guessDataTypeByColumn(columnValues: string[]): DataType {
	const guesser = guessDataType()

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
