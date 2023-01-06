/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'

import { guessDataType } from './guessDataType.js'

export function guessDataTypeFromValues(
	values: string[],
	limit = Infinity,
): DataType {
	const guesser = guessDataType()

	const mapTypes = new Map()

	for (let i = 0; i < limit && i < values.length; i++) {
		const dataTypeResult = guesser(values[i]!)
		mapTypes.set(dataTypeResult, true)
	}

	mapTypes.delete(DataType.Null)

	if (mapTypes.size === 0) {
		return DataType.Null
	}
	if (mapTypes.size === 1) {
		for (const key of mapTypes.keys()) {
			return key
		}
	}

	return DataType.String
}
