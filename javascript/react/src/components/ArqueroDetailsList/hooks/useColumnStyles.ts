/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsColumnStyles } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

export function useColumnStyles(
	clickable: boolean,
	separator: boolean,
): Partial<IDetailsColumnStyles> {
	const theme = useTheme()
	return useMemo(
		() => ({
			// we add our own sort icon in the DefaultColumnHeader component
			// this is because the onRenderHeader column function only
			// affects an inner div, which can be compressed when sorting is present
			// we therefore render it ourselves so we can control the layout completely.
			sortIcon: {
				display: 'none',
			},
			cursor: clickable ? 'pointer' : 'inherit',
			cellTitle: {
				borderRight: separator
					? `1px solid ${theme.palette.neutralLighter}`
					: '1px solid transparent',
			},
			cellTooltip: {
				display: 'initial',
				position: 'relative',
			},
		}),
		[theme, clickable, separator],
	)
}
