/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ValidationResult } from '@datashaper/schema'
import type { IIconStyles } from '@fluentui/react'
import { useMemo } from 'react'

export function useValidationIconProps(
	iconProps: IIconStyles,
	validationResult?: ValidationResult,
): any {
	return useMemo(() => {
		return {
			styles: iconProps,
			iconName:
				validationResult !== undefined && validationResult.errors.length > 0
					? 'Warning'
					: null,
		}
	}, [iconProps, validationResult])
}
