/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ValidationTestResult } from '@datashaper/schema'
import { DataType, ErrorCode } from '@datashaper/schema'

export function validateRequiredConstraint(): (
	values: unknown,
	includeInstances: boolean,
) => ValidationTestResult {
	return function validateRequiredConstraint(
		values: unknown,
		includeInstances: boolean,
	): ValidationTestResult {
		const valuesCasted = values as string[]

		if (!includeInstances) {
			return {
				fail: !valuesCasted.every(validateRequired),
				indexes: [],
				rule: ErrorCode.Required,
			}
		} else {
			const resultIndexes: number[] = []

			valuesCasted.map((value: string, index: number) => {
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

export function validateRequired(element: string): boolean {
	if (element == null || element == undefined || element.length == 0)
		return false

	return true
}

export function validateUniqueConstraint(): (
	values: unknown,
	includeInstances: boolean,
) => ValidationTestResult {
	return function validateUniqueConstraint(
		values: unknown,
		includeInstances: boolean,
	): ValidationTestResult {
		const uniqueValues = new Set<string>()
		const resultIndexes: number[] = []
		const valuesCasted = values as string[]

		valuesCasted.map((value: string, index: number) => {
			if (uniqueValues.has(value)) {
				if (includeInstances) resultIndexes.push(index)
			} else {
				uniqueValues.add(value)
			}
		})

		return {
			fail: valuesCasted.length !== uniqueValues.size,
			indexes: resultIndexes,
			rule: ErrorCode.Unique,
		}
	}
}

export function validateMinLengthConstraint(
	minLength: number,
	dataType: DataType,
): (values: unknown, includeInstances: boolean) => ValidationTestResult {
	const validate = validateMinLength(minLength)
	return function validateMinLengthConstraint(
		values: unknown,
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		const valuesCasted =
			dataType === DataType.String
				? (values as string[])
				: (values as Array<any>[])

		if (includeInstances) {
			valuesCasted.forEach((value: string | Array<any>, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.MinLength,
			}
		} else {
			return {
				fail: !(dataType === DataType.String
					? (values as string[]).every(validate)
					: (values as Array<any>[]).every(validate)),
				indexes: resultIndexes,
				rule: ErrorCode.MinLength,
			}
		}
	}
}

export function validateMinLength(
	minLength: number,
): (value: Array<any> | string) => boolean {
	return function validateMinLength(value: Array<any> | string) {
		return value.length >= minLength
	}
}

export function validateMaxLengthConstraint(
	maxLength: number,
	dataType: DataType,
): (values: unknown, includeInstances: boolean) => ValidationTestResult {
	const validate = validateMaxLength(maxLength)
	return function validateMaxLengthConstraint(
		values: unknown,
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		const valuesCasted =
			dataType === DataType.String
				? (values as string[])
				: (values as Array<any>[])

		if (includeInstances) {
			valuesCasted.forEach((value: string | Array<any>, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.MaxLength,
			}
		} else {
			return {
				fail: !(dataType === DataType.String
					? (values as string[]).every(validate)
					: (values as Array<any>[]).every(validate)),
				indexes: resultIndexes,
				rule: ErrorCode.MaxLength,
			}
		}
	}
}

export function validateMaxLength(
	maxLength: number,
): (value: Array<any> | string) => boolean {
	return function validateMaxLength(value: Array<any> | string) {
		return value.length <= maxLength
	}
}

export function validateMinimumConstraint(
	minimum: number,
	dataType: DataType,
): (values: unknown, includeInstances: boolean) => ValidationTestResult {
	const validate = validateMinimum(minimum, dataType)
	return function validateMinimumConstraint(
		values: unknown,
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		const valuesCasted =
			dataType === DataType.Number ? (values as number[]) : (values as Date[])

		if (includeInstances) {
			valuesCasted.forEach((value: number | Date, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.Minimum,
			}
		} else {
			return {
				fail: !(dataType === DataType.Number
					? (values as number[]).every(validate)
					: (values as Date[]).every(validate)),
				indexes: resultIndexes,
				rule: ErrorCode.Minimum,
			}
		}
	}
}

export function validateMinimum(
	minimum: number,
	dataType: DataType,
): (value: Date | number) => boolean {
	return function validateMinimum(value: Date | number) {
		return dataType == DataType.Date
			? value.valueOf() >= minimum
			: value >= minimum
	}
}

export function validateMaximumConstraint(
	maximum: number,
	dataType: DataType,
): (values: unknown, includeInstances: boolean) => ValidationTestResult {
	const validate = validateMaximum(maximum, dataType)
	return function validateMaximumConstraint(
		values: unknown,
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		const valuesCasted =
			dataType === DataType.Number ? (values as number[]) : (values as Date[])

		if (includeInstances) {
			valuesCasted.forEach((value: number | Date, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.Maximum,
			}
		} else {
			return {
				fail: !(dataType === DataType.Number
					? (values as number[]).every(validate)
					: (values as Date[]).every(validate)),
				indexes: resultIndexes,
				rule: ErrorCode.Maximum,
			}
		}
	}
}

export function validateMaximum(
	maximum: number,
	dataType: DataType,
): (value: Date | number) => boolean {
	return function validateMaximum(value: Date | number) {
		return dataType == DataType.Date
			? value.valueOf() <= maximum
			: value <= maximum
	}
}

export function validatePatternConstraint(
	pattern: string,
): (values: unknown, includeInstances: boolean) => ValidationTestResult {
	const validate = validatePattern(pattern)
	return function validatePatternConstraint(
		values: unknown,
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		const valuesCasted = values as string[]

		if (includeInstances) {
			valuesCasted.forEach((value: string, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.Pattern,
			}
		} else {
			return {
				fail: !valuesCasted.every(validate),
				indexes: resultIndexes,
				rule: ErrorCode.Pattern,
			}
		}
	}
}

export function validatePattern(pattern: string): (value: string) => boolean {
	return function validatePattern(value: string) {
		const re = new RegExp(pattern)
		return re.test(value)
	}
}

export function validateEnumConstraint(
	enumList: string[],
): (values: unknown, includeInstances: boolean) => ValidationTestResult {
	const validate = validateEnum(enumList)
	return function validateEnumConstraint(
		values: unknown,
		includeInstances: boolean,
	): ValidationTestResult {
		const resultIndexes: number[] = []
		const valuesCasted = values as string[]

		if (includeInstances) {
			valuesCasted.forEach((value: string, index: number) => {
				if (!validate(value)) resultIndexes.push(index)
			})
			return {
				fail: resultIndexes.length !== 0,
				indexes: resultIndexes,
				rule: ErrorCode.Enum,
			}
		} else {
			return {
				fail: !valuesCasted.every(validate),
				indexes: resultIndexes,
				rule: ErrorCode.Enum,
			}
		}
	}
}

export function validateEnum(enumList: string[]): (value: string) => boolean {
	return function validateEnum(value: string) {
		return enumList.includes(value)
	}
}
