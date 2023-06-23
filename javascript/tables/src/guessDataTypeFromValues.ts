/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat, DataType } from '@datashaper/schema'

import { guessDataType } from './guessDataType.js'

export function guessDataTypeFromValues(
	values: unknown[],
	format: DataFormat = DataFormat.CSV,
	limit = Infinity,
): DataType {
	const guesser = guessDataType({ dataFormat: format })
	const detectedTypes = new Set<DataType>()

	for (let i = 0; i < limit && i < values.length; i++) {
		const type = guesser(`${values[i]}`)
		detectedTypes.add(type)
	}

	detectedTypes.delete(DataType.Null)

	if (detectedTypes.size === 0) {
		return DataType.Null
	} else if (detectedTypes.size === 1) {
		for (const key of detectedTypes.keys()) {
			return key
		}
		throw new Error('should not be possible')
	} else if (detectedTypes.has(DataType.Array) && format === DataFormat.CSV) {
		// arrays will be detected even if some cells have other types (which would parse as single-length arrays)
		// so we'll call it an array type if even one exists
		return DataType.Array
	} else {
		return DataType.String
	}
}
