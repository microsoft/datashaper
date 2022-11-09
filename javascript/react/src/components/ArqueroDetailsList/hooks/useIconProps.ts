/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ValidationResult } from '@datashaper/schema'
import type { IIconStyles } from '@fluentui/react'
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useIconProps(validationResult?: ValidationResult): IIconStyles {
	const theme = useThematic()
	return useMemo(
		() => ({
			root: {
				cursor: 'pointer',
				fontSize: 14,
				width: 14, // to match the default icon on the left
				color:
					validationResult !== undefined && validationResult.errors.length > 0
						? theme.application().warning().hex()
						: null,
			},
		}),
		[theme, validationResult],
	)
}
