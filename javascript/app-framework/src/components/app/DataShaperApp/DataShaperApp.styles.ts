/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export const PANE_BREAK_WIDTH = 150
export const PANE_EXPANDED_SIZE = 300
export const PANE_MAX_SIZE = 600
export const PANE_COLLAPSED_SIZE = 36

export function useFileTreeStyle(): React.CSSProperties {
	const theme = useTheme()
	return useMemo(
		() => ({
			borderRight: `2px solid ${theme.palette.neutralTertiaryAlt}`,
		}),
		[theme],
	)
}
