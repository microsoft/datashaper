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
import { DataType, ErrorCode } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

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
				results.errors.map((result: FieldError) => {
					validationResult.errors!.push(result!)
				})
			}
		}
	})

	return validationResult
}

function validateColumn(
	values: any[],
	name: string,
	dataType: DataType,
	constraints: Constraints,
	includeInstances: boolean,
): ValidationResult {
	const results: ValidationResult = {
		errors: [],
	}
	const validators: ((
		values: any[],
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
		(dataType == DataType.String || dataType == DataType.Array)
	) {
		validators.push(validateMinLengthConstraint(constraints.minLength))
	}
	if (
		constraints.maxLength &&
		(dataType == DataType.String || dataType == DataType.Array)
	) {
		validators.push(validateMaxLengthConstraint(constraints.maxLength))
	}
	if (
		constraints.minimum &&
		(dataType == DataType.Number || dataType == DataType.Date)
	) {
		validators.push(validateMinimumConstraint(constraints.minimum, dataType))
	}
	if (
		constraints.maximum &&
		(dataType == DataType.Number || dataType == DataType.Date)
	) {
		validators.push(validateMaximumConstraint(constraints.maximum, dataType))
	}
	if (constraints.pattern && dataType == DataType.String) {
		validators.push(validatePatternConstraint(constraints.pattern))
	}
	if (constraints.enum && dataType == DataType.String) {
		validators.push(validateEnumConstraint(constraints.enum))
	}

	validators.forEach(validator => {
		const result: ValidationTestResult = validator(values, includeInstances)
		if (result.fail && results.errors != null) {
			results.errors.push({
				name: name,
				rule: result.rule,
				indexes: result.indexes,
			})
		}
	})

	return results
}

function validateRequiredConstraint(): (
	values: string[],
	includeInstances: boolean,
) => ValidationTestResult {
	return function validateRequiredConstraint(
		values: string[],
		includeInstances: boolean,
	): ValidationTestResult {
		if (!includeInstances) {
			return {
				fail: !values.every(validateRequired),
				indexes: [],
				rule: ErrorCode.Required,
			}
		} else {
			const resultIndexes: number[] = []

			values.map((value: string, index: number) => {
				if (!validateRequired(value)) resultIndexes.push(index)
			})

			return {
				fail: resultIndexes.length != 0,
				indexes: resultIndexes,
				rule: ErrorCode.Required,
			}
		}
	}
}

function validateRequired(element: string): boolean {
	if (element == null || element == undefined || element.length == 0)
		return false

	return true
}

function validateUniqueConstraint(): (
	values: string[],
	includeInstances: boolean,
) => ValidationTestResult {
	return function validateUniqueConstraint(
		values: string[],
		includeInstances: boolean,
	): ValidationTestResult {
		const uniqueValues = new Set<string>()
		const resultIndexes: number[] = []

		values.map((value: string, index: number) => {
			if (uniqueValues.has(value)) {
				if (includeInstances) resultIndexes.push(index)
			} else {
				uniqueValues.add(value)
			}
		})

		return {
			fail: values.length !== uniqueValues.size,
			indexes: resultIndexes,
			rule: ErrorCode.Unique,
		}
	}
}

function validateMinLengthConstraint(
	minLength: number,
): (
	values: string[] | Array<any>[],
	includeInstances: boolean,
) => ValidationTestResult {
	const validate = validateMinLength(minLength)
	return function validateMinLengthConstraint(
		values: string[] | Array<any>[],
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		if (includeInstances) {
			values.forEach((value: string | Array<any>, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.MinLength,
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
				rule: ErrorCode.MinLength,
			}
		}
	}
}

function validateMinLength(
	minLength: number,
): (value: Array<any> | string) => boolean {
	return function validateMinLength(value: Array<any> | string) {
		return value.length >= minLength
	}
}

function validateMaxLengthConstraint(
	maxLength: number,
): (
	values: string[] | Array<any>[],
	includeInstances: boolean,
) => ValidationTestResult {
	const validate = validateMaxLength(maxLength)
	return function validateMaxLengthConstraint(
		values: string[] | Array<any>[],
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		if (includeInstances) {
			values.forEach((value: string | Array<any>, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.MaxLength,
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
				rule: ErrorCode.MaxLength,
			}
		}
	}
}

function validateMaxLength(
	maxLength: number,
): (value: Array<any> | string) => boolean {
	return function validateMaxLength(value: Array<any> | string) {
		return value.length <= maxLength
	}
}

function validateMinimumConstraint(
	minimum: number,
	dataType: DataType,
): (
	values: number[] | Date[],
	includeInstances: boolean,
) => ValidationTestResult {
	const validate = validateMinimum(minimum, dataType)
	return function validateMinimumConstraint(
		values: number[] | Date[],
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		if (includeInstances) {
			values.forEach((value: number | Date, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.Minimum,
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
				rule: ErrorCode.Minimum,
			}
		}
	}
}

function validateMinimum(
	minimum: number,
	dataType: DataType,
): (value: Date | number) => boolean {
	return function validateMinimum(value: Date | number) {
		return dataType == DataType.Date
			? value.valueOf() >= minimum
			: value >= minimum
	}
}

function validateMaximumConstraint(
	maximum: number,
	dataType: DataType,
): (
	values: number[] | Date[],
	includeInstances: boolean,
) => ValidationTestResult {
	const validate = validateMaximum(maximum, dataType)
	return function validateMaximumConstraint(
		values: number[] | Date[],
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		if (includeInstances) {
			values.forEach((value: number | Date, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.Maximum,
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
				rule: ErrorCode.Maximum,
			}
		}
	}
}

function validateMaximum(
	maximum: number,
	dataType: DataType,
): (value: Date | number) => boolean {
	return function validateMaximum(value: Date | number) {
		return dataType == DataType.Date
			? value.valueOf() <= maximum
			: value <= maximum
	}
}

function validatePatternConstraint(
	pattern: string,
): (values: string[], includeInstances: boolean) => ValidationTestResult {
	const validate = validatePattern(pattern)
	return function validatePatternConstraint(
		values: string[],
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		if (includeInstances) {
			values.forEach((value: string, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.Pattern,
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
				rule: ErrorCode.Pattern,
			}
		}
	}
}

function validatePattern(pattern: string): (value: string) => boolean {
	return function validatePattern(value: string) {
		const re = new RegExp(pattern)
		return re.test(value)
	}
}

function validateEnumConstraint(
	enumList: string[],
): (values: string[], includeInstances: boolean) => ValidationTestResult {
	const validate = validateEnum(enumList)
	return function validateEnumConstraint(
		values: string[],
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		if (includeInstances) {
			values.forEach((value: string, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.Enum,
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
				rule: ErrorCode.Enum,
			}
		}
	}
}

function validateEnum(enumList: string[]): (value: string) => boolean {
	return function validateEnum(value: string) {
		return enumList.includes(value)
	}
}
