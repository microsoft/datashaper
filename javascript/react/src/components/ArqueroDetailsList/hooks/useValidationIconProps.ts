/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ValidationResult } from '@datashaper/schema'
import type { IIconStyles } from '@fluentui/react'

export function useValidationIconProps(
	iconProps: IIconStyles,
	validationResult?: ValidationResult,
): any {
	return {
		styles: iconProps,
		iconName:
			validationResult !== undefined && validationResult.errors.length > 0
				? 'Warning'
				: null,
	}
}
