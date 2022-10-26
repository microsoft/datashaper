/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	ColumnError,
	Field,
	ValidationResult,
} from '@datashaper/schema'
import { DataType } from '@datashaper/schema'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function validateTable(
	table: ColumnTable,
	codebook: CodebookSchema,
): ValidationResult {
	const validationResult: ValidationResult = {
		columnErrors: [],
	}

	codebook.fields.forEach((field: Field) => {
		const columnValues = table.array(field.name)
		let flag = false
		if (field.constraints != null) {
			const constraints = field.constraints

			//required constraint
			if (!flag && constraints.required != null && constraints.required) {
				const requiredResult = checkRequiredConstraint(columnValues as string[])
				if (!requiredResult) {
					flag = true
					if (validationResult.columnErrors != null)
						validationResult.columnErrors.push(
							createColumnErrorObject(field.name, 'required'),
						)
				}
			}

			//unique constraint
			if (!flag && constraints.unique != null && constraints.unique) {
				const uniqueResult = checkUniqueConstraint(columnValues as string[])
				if (!uniqueResult) {
					flag = true

					if (validationResult.columnErrors != null)
						validationResult.columnErrors.push(
							createColumnErrorObject(field.name, 'unique'),
						)
				}
			}

			//minLength constraint - for string and arrays only
			if (
				!flag &&
				constraints.minLength != null &&
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
				)
				if (!minLengthResult) {
					flag = true

					if (validationResult.columnErrors != null)
						validationResult.columnErrors.push(
							createColumnErrorObject(field.name, 'minLength'),
						)
				}
			}

			//maxLength constraint - for string and arrays only
			if (
				!flag &&
				constraints.maxLength != null &&
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
					flag = true

					if (validationResult.columnErrors != null)
						validationResult.columnErrors.push(
							createColumnErrorObject(field.name, 'maxLength'),
						)
				}
			}

			//minimum constraint - for numbers or dates only
			if (
				!flag &&
				constraints.minimum != null &&
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
				)
				if (!minimumResult) {
					flag = true

					if (validationResult.columnErrors != null)
						validationResult.columnErrors.push(
							createColumnErrorObject(field.name, 'minimum'),
						)
				}
			}

			//maximum constraint - for numbers or dates only
			if (
				!flag &&
				constraints.maximum != null &&
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
				)
				if (!maximumResult) {
					flag = true

					if (validationResult.columnErrors != null)
						validationResult.columnErrors.push(
							createColumnErrorObject(field.name, 'maximum'),
						)
				}
			}

			//pattern constraint - for strings only
			if (
				!flag &&
				constraints.pattern != null &&
				constraints.pattern &&
				field.type === DataType.String
			) {
				const patternResult = checkPatternConstraint(
					constraints.pattern,
					columnValues as string[],
				)
				if (!patternResult) {
					flag = true

					if (validationResult.columnErrors != null)
						validationResult.columnErrors.push(
							createColumnErrorObject(field.name, 'pattern'),
						)
				}
			}

			//enum constraint - for strings only
			if (
				!flag &&
				constraints.enum != null &&
				constraints.enum &&
				field.type === DataType.String
			) {
				const enumResult = checkEnumConstraint(
					constraints.enum,
					columnValues as string[],
				)
				if (!enumResult) {
					flag = true

					if (validationResult.columnErrors != null)
						validationResult.columnErrors.push(
							createColumnErrorObject(field.name, 'enum'),
						)
				}
			}
		}
	})

	return validationResult
}

function createColumnErrorObject(name: string, message: string): ColumnError {
	const columnError: ColumnError = {
		columnName: name,
		rule: message,
	}

	return columnError
}

function checkRequiredConstraint(values: string[]): boolean {
	for (let i = 0; i < values.length; i++) {
		if (
			values[i] == null ||
			values[i] == undefined ||
			(values[i] as string).length == 0
		)
			return false
	}

	return true
}

function checkUniqueConstraint(values: string[]): boolean {
	const uniqueValues = [...new Set(values)]
	return values.length === uniqueValues.length
}

function checkMinLengthConstraint(
	minLength: number,
	values: string[] | Array<any>[],
): boolean {
	for (let i = 0; i < values.length; i++) {
		if (values[i] != null && values[i]!.length < minLength) return false
	}

	return true
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
): boolean {
	for (let i = 0; i < values.length; i++) {
		if (values[i] != null && values[i]! < minimum) return false
	}

	return true
}

function checkMaximumConstraint(
	maximum: number,
	values: number[] | Date[],
): boolean {
	for (let i = 0; i < values.length; i++) {
		if (values[i] != null && values[i]! > maximum) return false
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
