/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FieldError, ValidationResult } from '@datashaper/schema'
import { useMemo } from 'react'

/**
 * Run through the validation results for the column and apply to this cell value to determine if more information should be rendered.
 * @param value
 * @param validationResult
 * @returns
 */
export function useValidationErrors(
	value: unknown,
	validationResult?: ValidationResult,
): FieldError[] {
	return useMemo(
		() =>
			(validationResult?.errors
				?.map(e => (e.validate ? e.validate!([value]) : undefined))
				.filter(e => e !== undefined) || []) as FieldError[],
		[value, validationResult],
	)
}
