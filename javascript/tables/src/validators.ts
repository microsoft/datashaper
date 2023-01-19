/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field, ValidationFunction } from '@datashaper/schema'
import { DataType, ErrorCode } from '@datashaper/schema'
/**
 * This is a collection of validation function factories for each possible Constraint.
 * Each factory takes a Field and returns a function that validates a column against that constraint.
 * The returned function takes an array of values and an optional boolean indicating whether to include the indexes of the row instances that failed validation.
 * The returned function returns a FieldError if the validation fails, otherwise undefined.
 *
 * Note that each validator has two implementations internally:
 * 1. If includeIndexes is true, the validator will return a FieldError with the indexes of the row instances that failed validation. This is necessarily slower because every row must be checked.
 * 2. If includeIndexes is false, the validator will shortcut and return when the first failure is found.
 */

/**
 * Constructs a function that validates a column against the `required` constraint.
 */
export function requiredValidator(
	field: Field,
	includeIndexes: boolean,
): ValidationFunction | undefined {
	const { name, constraints } = field
	if (constraints?.required) {
		const validate = (element: unknown) =>
			element !== null && element !== undefined
		return values => {
			const result = {
				name,
				rule: ErrorCode.Required,
				constraints,
			}
			if (includeIndexes) {
				const indexes = values.reduce((acc: number[], cur, index) => {
					if (!validate(cur)) acc.push(index)
					return acc
				}, [])
				if (indexes.length !== 0) {
					return {
						...result,
						indexes,
					}
				}
			} else {
				if (!values.every(validate)) {
					return result
				}
			}
		}
	}
}

/**
 * Constructs a function that validates a column against the `unique` constraint.
 */
export function uniqueValidator(
	field: Field,
	includeIndexes: boolean,
): ValidationFunction | undefined {
	const { name, constraints } = field
	if (constraints?.unique) {
		return values => {
			const result = {
				name,
				rule: ErrorCode.Unique,
				constraints,
			}
			const uniqueValues = new Set<unknown>()
			if (includeIndexes) {
				const indexes = values.reduce((acc: number[], cur, index) => {
					if (uniqueValues.has(cur)) {
						acc.push(index)
					}
					uniqueValues.add(cur)
					return acc
				}, [])
				if (indexes.length !== 0) {
					return {
						...result,
						indexes,
					}
				}
			} else {
				const fail = !values.every(value => {
					if (uniqueValues.has(value)) {
						return false
					}
					uniqueValues.add(value)
					return true
				})
				if (fail) {
					return result
				}
			}
		}
	}
}

/**
 * Constructs a function that validates a column against the `minLength` constraint.
 */
export function minLengthValidator(
	field: Field,
	includeIndexes: boolean,
): ValidationFunction | undefined {
	const { name, type, constraints = {} } = field
	const { minLength } = constraints
	if (
		minLength !== undefined &&
		(type === DataType.String || type === DataType.Array)
	) {
		const validate = (value: unknown[] | string) => value.length >= minLength
		return values => {
			const result = {
				name,
				rule: ErrorCode.MinLength,
				constraints,
			}
			if (includeIndexes) {
				const indexes = ((values as string[]) || Array<unknown[]>).reduce(
					(acc: number[], cur, index) => {
						if (!validate(cur)) acc.push(index)
						return acc
					},
					[],
				)
				if (indexes.length !== 0) {
					return {
						...result,
						indexes,
					}
				}
			} else {
				const fail = !(type === DataType.String
					? (values as string[]).every(validate)
					: (values as Array<unknown[]>).every(validate))
				if (fail) {
					return result
				}
			}
		}
	}
}

/**
 * Constructs a function that validates a column against the `maxLength` constraint.
 */
export function maxLengthValidator(
	field: Field,
	includeIndexes: boolean,
): ValidationFunction | undefined {
	const { name, type, constraints = {} } = field
	const { maxLength } = constraints
	if (maxLength && (type === DataType.String || type === DataType.Array)) {
		const validate = (value: unknown[] | string) => value.length <= maxLength
		return values => {
			const result = {
				name,
				rule: ErrorCode.MaxLength,
				constraints,
			}
			if (includeIndexes) {
				const indexes = ((values as string[]) || Array<unknown[]>).reduce(
					(acc: number[], cur, index) => {
						if (!validate(cur)) acc.push(index)
						return acc
					},
					[],
				)
				if (indexes.length !== 0) {
					return {
						...result,
						indexes,
					}
				}
			} else {
				const fail = !(type === DataType.String
					? (values as string[]).every(validate)
					: (values as Array<unknown[]>).every(validate))
				if (fail) {
					return result
				}
			}
		}
	}
}

/**
 * Constructs a function that validates a column against the `minimum` constraint.
 */
export function minimumValidator(
	field: Field,
	includeIndexes: boolean,
): ValidationFunction | undefined {
	const { name, type, constraints = {} } = field
	const { minimum } = constraints
	if (
		minimum !== undefined &&
		(type === DataType.Number || type === DataType.Date)
	) {
		const validate = (value: Date | number) =>
			type === DataType.Date ? value.valueOf() >= minimum : value >= minimum
		return values => {
			const result = {
				name,
				rule: ErrorCode.Minimum,
				constraints,
			}
			if (includeIndexes) {
				const valuesCasted =
					type === DataType.Number ? (values as number[]) : (values as Date[])
				const indexes: number[] = []
				valuesCasted.forEach((value, index) => {
					if (!validate(value)) indexes.push(index)
				})
				if (indexes.length !== 0) {
					return {
						...result,
						indexes,
					}
				}
			} else {
				const fail = !(type === DataType.Number
					? (values as number[]).every(validate)
					: (values as Date[]).every(validate))
				if (fail) {
					return result
				}
			}
		}
	}
}

/**
 * Constructs a function that validates a column against the `maximum` constraint.
 */
export function maximumValidator(
	field: Field,
	includeIndexes: boolean,
): ValidationFunction | undefined {
	const { name, type, constraints = {} } = field
	const { maximum } = constraints
	if (maximum !== undefined) {
		const validate = (value: Date | number) =>
			type === DataType.Date ? value.valueOf() <= maximum : value <= maximum
		return values => {
			const result = {
				name,
				rule: ErrorCode.Maximum,
				constraints,
			}
			if (includeIndexes) {
				const valuesCasted =
					type === DataType.Number ? (values as number[]) : (values as Date[])
				const indexes: number[] = []
				valuesCasted.forEach((value, index) => {
					if (!validate(value)) indexes.push(index)
				})
				if (indexes.length !== 0) {
					return {
						...result,
						indexes,
					}
				}
			} else {
				const fail = !(type === DataType.Number
					? (values as number[]).every(validate)
					: (values as Date[]).every(validate))
				if (fail) {
					return result
				}
			}
		}
	}
}

/**
 * Constructs a function that validates a column against the `pattern` constraint.
 */
export function patternValidator(
	field: Field,
	includeIndexes: boolean,
): ValidationFunction | undefined {
	const { name, type, constraints = {} } = field
	const { pattern } = constraints
	if (pattern && type === DataType.String) {
		const re = new RegExp(pattern)
		const validate = (value: string) => re.test(value)
		return values => {
			const result = {
				name,
				rule: ErrorCode.Pattern,
				constraints,
			}
			if (includeIndexes) {
				const indexes = (values as string[]).reduce(
					(acc: number[], value, index) => {
						if (!validate(value)) acc.push(index)
						return acc
					},
					[],
				)
				if (indexes.length !== 0) {
					return {
						...result,
						indexes,
					}
				}
			} else {
				if (!(values as string[]).every(validate)) {
					return result
				}
			}
		}
	}
}

/**
 * Constructs a function that validates a column against the `enum` constraint.
 */
export function enumValidator(
	field: Field,
	includeIndexes: boolean,
): ValidationFunction | undefined {
	const { name, type, constraints = {} } = field
	const { enum: enumList } = constraints
	if (enumList && type === DataType.String) {
		const uniqueSet = new Set(enumList)
		const validate = (value: string) => uniqueSet.has(value)
		return values => {
			const result = {
				name,
				rule: ErrorCode.Enum,
				constraints,
			}
			if (includeIndexes) {
				const indexes = (values as string[]).reduce(
					(acc: number[], value, index) => {
						if (!validate(value)) acc.push(index)
						return acc
					},
					[],
				)
				if (indexes.length !== 0) {
					return {
						...result,
						indexes,
					}
				}
			} else {
				if (!(values as string[]).every(validate)) {
					return result
				}
			}
		}
	}
}
