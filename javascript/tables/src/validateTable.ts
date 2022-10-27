/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	Field,
	FieldError,
	ValidationResult,
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
				const requiredResult = checkRequiredConstraint(
					columnValues as string[],
					includeInstances,
				)
				const [isRequired, instances] = requiredResult

				if (!isRequired) {
					if (validationResult.errors != null)
						validationResult.errors.push(
							createFieldErrorObject(
								field.name,
								ErrorCode.Required,
								includeInstances,
								instances,
							),
						)
				}
			}

			//unique constraint
			if (constraints.unique) {
				const uniqueResult = checkUniqueConstraint(
					columnValues as string[],
					includeInstances,
				)
				const [isUnique, instances] = uniqueResult

				if (!isUnique) {
					if (validationResult.errors != null)
						validationResult.errors.push(
							createFieldErrorObject(
								field.name,
								ErrorCode.Unique,
								includeInstances,
								instances,
							),
						)
				}
			}

			//minLength constraint - for string and arrays only
			if (
				constraints.minLength &&
				(field.type === DataType.Array || field.type === DataType.String)
			) {
				const minLengthResult = checkMinLengthConstraint(
					constraints.minLength,
					field.type === DataType.Array
						? (columnValues as Array<any>[])
						: field.type === DataType.String
						? (columnValues as string[])
						: [],
					includeInstances,
				)
				const [isMinLength, instances] = minLengthResult

				if (!isMinLength) {
					if (validationResult.errors != null)
						validationResult.errors.push(
							createFieldErrorObject(
								field.name,
								ErrorCode.MinLength,
								includeInstances,
								instances,
							),
						)
				}
			}

			//maxLength constraint - for string and arrays only
			if (
				constraints.maxLength &&
				(field.type === DataType.Array || field.type === DataType.String)
			) {
				const maxLengthResult = checkMaxLengthConstraint(
					constraints.maxLength,
					field.type === DataType.Array
						? (columnValues as Array<any>[])
						: field.type === DataType.String
						? (columnValues as string[])
						: [],
				)
				if (!maxLengthResult) {
					if (validationResult.errors != null)
						validationResult.errors.push(
							createFieldErrorObject(
								field.name,
								ErrorCode.MaxLength,
								false,
								[],
							),
						)
				}
			}

			//minimum constraint - for numbers or dates only
			if (
				constraints.minimum &&
				(field.type === DataType.Number || field.type === DataType.Date)
			) {
				const minimumResult = checkMinimumConstraint(
					constraints.minimum,
					field.type === DataType.Number
						? (columnValues as number[])
						: field.type === DataType.Date
						? (columnValues as Date[])
						: [],
					field.type,
				)
				if (!minimumResult) {
					if (validationResult.errors != null)
						validationResult.errors.push(
							createFieldErrorObject(field.name, ErrorCode.Minimum, false, []),
						)
				}
			}

			//maximum constraint - for numbers or dates only
			if (
				constraints.maximum &&
				(field.type === DataType.Number || field.type === DataType.Date)
			) {
				const maximumResult = checkMaximumConstraint(
					constraints.maximum,
					field.type === DataType.Number
						? (columnValues as number[])
						: field.type === DataType.Date
						? (columnValues as Date[])
						: [],
					field.type,
				)
				if (!maximumResult) {
					if (validationResult.errors != null)
						validationResult.errors.push(
							createFieldErrorObject(field.name, ErrorCode.Maximum, false, []),
						)
				}
			}

			//pattern constraint - for strings only
			if (constraints.pattern && field.type === DataType.String) {
				const patternResult = checkPatternConstraint(
					constraints.pattern,
					columnValues as string[],
				)
				if (!patternResult) {
					if (validationResult.errors != null)
						validationResult.errors.push(
							createFieldErrorObject(field.name, ErrorCode.Pattern, false, []),
						)
				}
			}

			//enum constraint - for strings only
			if (constraints.enum && field.type === DataType.String) {
				const enumResult = checkEnumConstraint(
					constraints.enum,
					columnValues as string[],
				)
				if (!enumResult) {
					if (validationResult.errors != null)
						validationResult.errors.push(
							createFieldErrorObject(field.name, ErrorCode.Enum, false, []),
						)
				}
			}
		}
	})

	return validationResult
}

function createFieldErrorObject(
	name: string,
	message: ErrorCode,
	includeInstances: boolean,
	instances: number[],
): FieldError {
	const fieldError: FieldError = {
		name: name,
		rule: message,
	}

	if (includeInstances) {
		fieldError.indexes = instances
	}

	return fieldError
}

function checkRequiredConstraint(
	values: string[],
	includeInstances: boolean,
): [boolean, number[]] {
	if (!includeInstances) return [values.every(requiredRule), []]

	const resultIndexes: number[] = []

	values.map((value: string, index: number) => {
		if (!requiredRule(value)) resultIndexes.push(index)
	})

	return resultIndexes.length != 0 ? [false, resultIndexes] : [true, []]
}

function requiredRule(element: string): boolean {
	if (element == null || element == undefined || element.length == 0)
		return false

	return true
}

function checkUniqueConstraint(
	values: string[],
	includeInstances: boolean,
): [boolean, number[]] {
	const uniqueValues = new Set<string>()
	const resultIndexes: number[] = []

	values.map((value: string, index: number) => {
		if (uniqueValues.has(value)) {
			if (includeInstances) resultIndexes.push(index)
		} else uniqueValues.add(value)
	})

	return [values.length === uniqueValues.size, resultIndexes]
}

function checkMinLengthConstraint(
	minLength: number,
	values: string[] | Array<any>[],
	includeInstances: boolean,
): [boolean, number[]] {
	const resultIndexes: number[] = []

	for (let i = 0; i < values.length; i++) {
		if (values[i] != null && values[i]!.length < minLength) {
			if (!includeInstances) return [false, []]

			resultIndexes.push(i)
		}
	}

	return resultIndexes.length != 0 ? [false, resultIndexes] : [true, []]
}

function checkMaxLengthConstraint(
	maxLength: number,
	values: string[] | Array<any>[],
): boolean {
	for (let i = 0; i < values.length; i++) {
		if (values[i] != null && values[i]!.length > maxLength) return false
	}

	return true
}

function checkMinimumConstraint(
	minimum: number,
	values: number[] | Date[],
	dataType: DataType,
): boolean {
	for (let i = 0; i < values.length; i++) {
		if (
			values[i] != null && dataType == DataType.Date
				? values[i]!.valueOf()
				: values[i]! < minimum
		)
			return false
	}

	return true
}

function checkMaximumConstraint(
	maximum: number,
	values: number[] | Date[],
	dataType: DataType,
): boolean {
	for (let i = 0; i < values.length; i++) {
		if (
			values[i] != null && dataType == DataType.Date
				? values[i]!.valueOf()
				: values[i]! > maximum
		)
			return false
	}

	return true
}

function checkPatternConstraint(pattern: string, values: string[]): boolean {
	const re = new RegExp(pattern)

	for (let i = 0; i < values.length; i++) {
		if (values[i] != null && !re.test(values[i] as string)) return false
	}

	return true
}

function checkEnumConstraint(enumList: string[], values: string[]): boolean {
	for (let i = 0; i < values.length; i++) {
		if (values[i] != null && !enumList.includes(values[i] as string))
			return false
	}

	return true
}
