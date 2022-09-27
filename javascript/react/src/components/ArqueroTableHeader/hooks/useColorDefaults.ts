/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export function useColorDefaults(
	color?: string,
	background?: string,
): {
	background: string
	foreground: string
} {
	const theme = useTheme()
	return useMemo(
		() => ({
			background: background || theme.palette.themePrimary,
			foreground: color || theme.palette.white,
		}),
		[theme, background, color],
	)
}
