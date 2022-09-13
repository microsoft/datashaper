/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useThematic } from '@thematic/react'
import { useMemo } from 'react'

export function useColorDefaults(
	color?: string,
	background?: string,
): {
	background: string
	foreground: string
} {
	const theme = useThematic()
	return useMemo(
		() => ({
			background: background || theme.application().accent().hex(),
			foreground: color || theme.application().background().hex(),
		}),
		[theme, background, color],
	)
}
