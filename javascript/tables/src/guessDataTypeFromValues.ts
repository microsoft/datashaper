/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataType } from '@datashaper/schema'

import { guessDataType } from './guessDataType.js'

export function guessDataTypeFromValues(values: string[]): DataType {
	const guesser = guessDataType()

	const mapTypes = new Map()

	values.forEach(value => {
		const dataTypeResult = guesser(value)
		mapTypes.set(dataTypeResult, true)
	})

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
