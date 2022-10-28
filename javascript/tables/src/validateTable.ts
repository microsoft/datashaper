/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	Field,
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
		if (field.constraints != null) {
			const constraints = field.constraints
			const columnValues = table.array(field.name)

			//required constraint
			if (constraints.required) {
				const requiredResult: ValidationTestResult = validateRequiredConstraint(
					columnValues as string[],
					includeInstances,
				)

				if (requiredResult.fail) {
					if (validationResult.errors != null)
						validationResult.errors.push({
							name: field.name,
							rule: ErrorCode.Required,
							indexes: requiredResult.indexes,
						})
				}
			}

			//unique constraint
			if (constraints.unique) {
				const uniqueResult: ValidationTestResult = validateUniqueConstraint(
					columnValues as string[],
					includeInstances,
				)

				if (uniqueResult.fail) {
					if (validationResult.errors != null)
						validationResult.errors.push({
							name: field.name,
							rule: ErrorCode.Unique,
							indexes: uniqueResult.indexes,
						})
				}
			}

			//minLength constraint - for string and arrays only
			if (
				constraints.minLength &&
				(field.type === DataType.Array || field.type === DataType.String)
			) {
				const minLengthResult: ValidationTestResult =
					validateMinLengthConstraint(constraints.minLength)(
						field.type === DataType.Array
							? (columnValues as Array<any>[])
							: field.type === DataType.String
							? (columnValues as string[])
							: [],
						includeInstances,
					)

				if (minLengthResult.fail) {
					if (validationResult.errors != null)
						validationResult.errors.push({
							name: field.name,
							rule: ErrorCode.MinLength,
							indexes: minLengthResult.indexes,
						})
				}
			}

			//maxLength constraint - for string and arrays only
			if (
				constraints.maxLength &&
				(field.type === DataType.Array || field.type === DataType.String)
			) {
				const maxLengthResult: ValidationTestResult =
					validateMaxLengthConstraint(constraints.maxLength)(
						field.type === DataType.Array
							? (columnValues as Array<any>[])
							: field.type === DataType.String
							? (columnValues as string[])
							: [],
						includeInstances,
					)
				if (maxLengthResult.fail) {
					if (validationResult.errors != null)
						validationResult.errors.push({
							name: field.name,
							rule: ErrorCode.MaxLength,
							indexes: maxLengthResult.indexes,
						})
				}
			}

			//minimum constraint - for numbers or dates only
			if (
				constraints.minimum &&
				(field.type === DataType.Number || field.type === DataType.Date)
			) {
				const minimumResult: ValidationTestResult = validateMinimumConstraint(
					constraints.minimum,
					field.type,
				)(
					field.type === DataType.Number
						? (columnValues as number[])
						: field.type === DataType.Date
						? (columnValues as Date[])
						: [],
					includeInstances,
				)
				if (minimumResult.fail) {
					if (validationResult.errors != null)
						validationResult.errors.push({
							name: field.name,
							rule: ErrorCode.Minimum,
							indexes: minimumResult.indexes,
						})
				}
			}

			//maximum constraint - for numbers or dates only
			if (
				constraints.maximum &&
				(field.type === DataType.Number || field.type === DataType.Date)
			) {
				const maximumResult: ValidationTestResult = validateMaximumConstraint(
					constraints.maximum,
					field.type,
				)(
					field.type === DataType.Number
						? (columnValues as number[])
						: field.type === DataType.Date
						? (columnValues as Date[])
						: [],
					includeInstances,
				)
				if (maximumResult.fail) {
					if (validationResult.errors != null)
						validationResult.errors.push({
							name: field.name,
							rule: ErrorCode.Maximum,
							indexes: maximumResult.indexes,
						})
				}
			}

			//pattern constraint - for strings only
			if (constraints.pattern && field.type === DataType.String) {
				const patternResult: ValidationTestResult = validatePatternConstraint(
					constraints.pattern,
				)(columnValues as string[], includeInstances)
				if (patternResult.fail) {
					if (validationResult.errors != null)
						validationResult.errors.push({
							name: field.name,
							rule: ErrorCode.Pattern,
							indexes: patternResult.indexes,
						})
				}
			}

			//enum constraint - for strings only
			if (constraints.enum && field.type === DataType.String) {
				const enumResult: ValidationTestResult = validateEnumConstraint(
					constraints.enum,
				)(columnValues as string[], includeInstances)
				if (enumResult.fail) {
					if (validationResult.errors != null)
						validationResult.errors.push({
							name: field.name,
							rule: ErrorCode.Enum,
							indexes: enumResult.indexes,
						})
				}
			}
		}
	})

	return validationResult
}

function validateRequiredConstraint(
	values: string[],
	includeInstances: boolean,
): ValidationTestResult {
	if (!includeInstances) {
		return {
			fail: !values.every(validateRequired),
			indexes: [],
		}
	} else {
		const resultIndexes: number[] = []

		values.map((value: string, index: number) => {
			if (!validateRequired(value)) resultIndexes.push(index)
		})

		return {
			fail: resultIndexes.length != 0,
			indexes: resultIndexes,
		}
	}
}

function validateRequired(element: string): boolean {
	if (element == null || element == undefined || element.length == 0)
		return false

	return true
}

function validateUniqueConstraint(
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

	return { fail: values.length !== uniqueValues.size, indexes: resultIndexes }
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
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
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
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
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
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
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
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
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
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
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
			}
		} else {
			return {
				fail: values.every(validate),
				indexes: resultIndexes,
			}
		}
	}
}

function validateEnum(enumList: string[]): (value: string) => boolean {
	return function validateEnum(value: string) {
		return enumList.includes(value)
	}
}
