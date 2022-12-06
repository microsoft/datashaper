/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	FieldError,
	ValidationResult,
	ValidationTestResult,
} from '@datashaper/schema'
import { useMemo } from 'react'

export function useValidationRenderer(
	value: any,
	validationResult?: ValidationResult,
): ValidationTestResult[] {
	return useMemo(
		() => getResults(value, validationResult),
		[value, validationResult],
	)
}

const getResults = (value: any, validationResult?: ValidationResult) => {
	const resultTestValidationList: ValidationTestResult[] = []

	if (validationResult !== undefined) {
		validationResult.errors.forEach((e: FieldError) => {
			if (e.callbackFunction !== undefined) {
				resultTestValidationList.push(e.callbackFunction([value], false))
			}
		})
	}

	return resultTestValidationList
}
