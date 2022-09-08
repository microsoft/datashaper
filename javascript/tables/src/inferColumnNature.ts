/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ColumnNature } from '@datashaper/schema';
import { VariableNature } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function inferColumnNature(
	table: ColumnTable,
	columnName: string,
	categoricalCountLimit = 10,
): ColumnNature {
	const column = table.array(columnName)
	if (column === undefined) {
		throw new Error(
			`Unable to infer variable nature for absent column ${columnName}`,
		)
	}

	const uniqueValues = [...new Set(column)]
	const uniqueNonNullValues = uniqueValues.filter(
		val => val !== undefined && val !== null,
	) // && !isNaN(val));
	const hasMissingData = uniqueValues.length !== uniqueNonNullValues.length // uniqueValues.includes(undefined) || uniqueValues.includes(null) || uniqueValues.includes(NaN);

	const isBoolean = uniqueNonNullValues.every(val => typeof val === 'boolean')
	const isString = uniqueNonNullValues.every(val => typeof val === 'string')
	const isNumber = uniqueNonNullValues.every(val => typeof val === 'number')
	const isInteger = uniqueNonNullValues.every(Number.isInteger)

	const inferredNature = {
		uniqueValues,
		uniquePresentValues: uniqueNonNullValues,
		hasMissingData,
		isBoolean,
		isString,
		isNumber,
		isInteger,
	}

	if (isBoolean) {
		return {
			...inferredNature,
			mostLikelyNature: VariableNature.Binary,
			possibleNatures: [VariableNature.Binary, VariableNature.Excluded],
		}
	}

	if (!isNumber) {
		return {
			...inferredNature,
			mostLikelyNature: VariableNature.Nominal,
			possibleNatures: [VariableNature.Nominal, VariableNature.Excluded],
		}
	}

	if (!isInteger) {
		return {
			...inferredNature,
			mostLikelyNature: VariableNature.Continuous,
			possibleNatures: [
				VariableNature.Continuous,
				VariableNature.Discrete,
				VariableNature.Excluded,
			],
		}
	}

	if (
		uniqueNonNullValues.length === 2 &&
		uniqueNonNullValues.includes(0) &&
		uniqueNonNullValues.includes(1)
	) {
		return {
			...inferredNature,
			mostLikelyNature: VariableNature.Binary,
			possibleNatures: [
				VariableNature.Binary,
				VariableNature.Ordinal,
				VariableNature.Nominal,
				VariableNature.Discrete,
				VariableNature.Discrete,
				VariableNature.Excluded,
			],
		}
	}

	if (uniqueNonNullValues.length < categoricalCountLimit) {
		return {
			...inferredNature,
			mostLikelyNature: VariableNature.Discrete,
			possibleNatures: [
				VariableNature.Discrete,
				VariableNature.Ordinal,
				VariableNature.Nominal,
				VariableNature.Continuous,
				VariableNature.Excluded,
			],
		}
	}

	return {
		...inferredNature,
		mostLikelyNature: VariableNature.Continuous,
		possibleNatures: [
			VariableNature.Continuous,
			VariableNature.Discrete,
			VariableNature.Ordinal,
			VariableNature.Nominal,
			VariableNature.Excluded,
		],
	}
}
