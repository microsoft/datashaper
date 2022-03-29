/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useColorDefaults(
	color?: string,
	bgColor?: string,
): {
	background: string
	foreground: string
} {
	const theme = useThematic()
	return useMemo(
		() => ({
			background: bgColor || theme.application().accent().hex(),
			foreground: color || theme.application().background().hex(),
		}),
		[theme, bgColor, color],
	)
}
