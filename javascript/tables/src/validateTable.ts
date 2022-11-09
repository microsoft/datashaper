/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	Constraints,
	Field,
	FieldError,
	ValidationResult,
	ValidationTestResult,
} from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import {
	validateEnumConstraint,
	validateMaximumConstraint,
	validateMaxLengthConstraint,
	validateMinimumConstraint,
	validateMinLengthConstraint,
	validatePatternConstraint,
	validateRequiredConstraint,
	validateUniqueConstraint,
} from './validationUtils.js'

export function validateTable(
	table: ColumnTable,
	codebook: CodebookSchema,
	includeInstances: boolean,
): ValidationResult {
	const validationResult: ValidationResult = {
		errors: [],
	}

	codebook.fields.forEach((field: Field) => {
		if (field.constraints != null && field.type != null) {
			const constraints = field.constraints
			const columnValues = table.array(field.name)

			const results: ValidationResult = validateColumn(
				columnValues,
				field.name,
				field.type,
				constraints,
				includeInstances,
			)
			if (results.errors != null && validationResult.errors != null) {
				results.errors.forEach((result: FieldError) => {
					validationResult.errors!.push(result!)
				})
			}
		}
	})

	return validationResult
}

function validateColumn(
	values: unknown,
	name: string,
	dataType: DataType,
	constraints: Constraints,
	includeInstances: boolean,
): ValidationResult {
	const results: ValidationResult = {
		errors: [],
	}
	const validators: ((
		values: unknown,
		includeInstances: boolean,
	) => ValidationTestResult)[] = []

	if (constraints.required) {
		validators.push(validateRequiredConstraint())
	}
	if (constraints.unique) {
		validators.push(validateUniqueConstraint())
	}
	if (
		constraints.minLength &&
		(dataType === DataType.String || dataType === DataType.Array)
	) {
		validators.push(
			validateMinLengthConstraint(constraints.minLength, dataType),
		)
	}
	if (
		constraints.maxLength &&
		(dataType === DataType.String || dataType === DataType.Array)
	) {
		validators.push(
			validateMaxLengthConstraint(constraints.maxLength, dataType),
		)
	}
	if (
		constraints.minimum &&
		(dataType === DataType.Number || dataType === DataType.Date)
	) {
		validators.push(validateMinimumConstraint(constraints.minimum, dataType))
	}
	if (
		constraints.maximum &&
		(dataType === DataType.Number || dataType === DataType.Date)
	) {
		validators.push(validateMaximumConstraint(constraints.maximum, dataType))
	}
	if (constraints.pattern && dataType === DataType.String) {
		validators.push(validatePatternConstraint(constraints.pattern))
	}
	if (constraints.enum && dataType === DataType.String) {
		validators.push(validateEnumConstraint(constraints.enum))
	}

	validators.forEach(validator => {
		const result: ValidationTestResult = validator(values, includeInstances)
		if (result.fail && results.errors != null) {
			results.errors.push({
				name: name,
				rule: result.rule,
				indexes: result.indexes,
				callbackFunction: validator,
			})
		}
	})

	return results
}
