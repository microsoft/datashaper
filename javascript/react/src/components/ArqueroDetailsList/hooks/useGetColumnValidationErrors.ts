/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FieldError, ValidationResult } from '@datashaper/schema'

export function useGetColumnValidationErrors(
	validationResult?: ValidationResult,
): string {
	let message = ''

	if (validationResult !== undefined) {
		validationResult.errors.forEach((e: FieldError, index: number) => {
			message = index === 0 ? e.rule : message + ' / ' + e.rule
		})
	}

	return message
}
