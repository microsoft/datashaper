/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { VariableNature } from '@datashaper/schema'

export function inferNatureFromValues(
	values: any[],
	categoricalCountLimit = 10,
): VariableNature {
	const uniqueValues = [...new Set(values)]
	const uniqueNonNullValues = uniqueValues.filter(
		val => val !== undefined && val !== null,
	)

	const isBoolean = uniqueNonNullValues.every(val => typeof val === 'boolean')
	const isNumber = uniqueNonNullValues.every(val => typeof val === 'number')
	const isInteger = uniqueNonNullValues.every(Number.isInteger)

	if (
		uniqueNonNullValues.length === 2 &&
		uniqueNonNullValues.includes(0) &&
		uniqueNonNullValues.includes(1)
	) {
		return VariableNature.Binary
	}

	if (isBoolean) {
		return VariableNature.Binary
	}

	if (isNumber) {
		if (isInteger && uniqueNonNullValues.length < categoricalCountLimit) {
			let isSeries = true
			let index = 1

			while (index < uniqueNonNullValues.length && isSeries) {
				isSeries =
					uniqueNonNullValues[index] === uniqueNonNullValues[index - 1] + 1
						? true
						: false
				index++
			}

			if (index >= uniqueNonNullValues.length) return VariableNature.Ordinal

			return VariableNature.Discrete
		} else if (
			isInteger &&
			uniqueNonNullValues.length >= categoricalCountLimit
		) {
			return VariableNature.Discrete
		}
	}

	if (!isNumber) {
		return VariableNature.Nominal
	}

	if (!isInteger) {
		return VariableNature.Continuous
	}

	return VariableNature.Continuous
}
