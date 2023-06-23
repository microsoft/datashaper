/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	Field,
	ValidationResult,
} from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import {
	enumValidator,
	maximumValidator,
	maxLengthValidator,
	minimumValidator,
	minLengthValidator,
	patternValidator,
	requiredValidator,
	uniqueValidator,
} from './validators.js'

/**
 * Validates an entire table against a codebook's Field constraints.
 * @param table - the table to validate
 * @param codebook - the codebook to use
 * @param includeIndexes - indicate whether to include the indexes of the rows that failed validation for each field
 * @returns
 */
export function validateTable(
	table: ColumnTable,
	codebook: CodebookSchema,
	includeIndexes = false,
): ValidationResult {
	return codebook.fields.reduce(
		(result: ValidationResult, field: Field) => {
			const results = validateColumn(table, field, includeIndexes)
			result.errors = [...result.errors, ...results.errors]
			return result
		},
		{
			errors: [],
		} as ValidationResult,
	)
}

/**
 * Validates a column against a Field definition's constraints.
 * @param table - the table to validate
 * @param name - the name of the column
 * @param dataType - the type of the column
 * @param constraints - the field constraints to validate against
 * @param includeIndexes - indicate whether to include the indexes of the row instances that failed validation
 * @returns
 */
export function validateColumn(
	table: ColumnTable,
	field: Field,
	includeIndexes: boolean,
): ValidationResult {
	const results: ValidationResult = {
		errors: [],
	}
	const { constraints, name, type } = field
	if (constraints && type) {
		const validators = [
			requiredValidator(field, includeIndexes),
			uniqueValidator(field, includeIndexes),
			minLengthValidator(field, includeIndexes),
			maxLengthValidator(field, includeIndexes),
			minimumValidator(field, includeIndexes),
			maximumValidator(field, includeIndexes),
			patternValidator(field, includeIndexes),
			enumValidator(field, includeIndexes),
		]
		const values = table.array(name)
		validators.forEach((validate) => {
			if (validate) {
				const result = validate(values)
				if (result) {
					results.errors.push({
						validate,
						...result,
					})
				}
			}
		})
	}
	return results
}
