/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ArqueroTableHeaderStyles,
	CommandBarColors,
} from '@datashaper/react'
import type { ToolPanelStyles } from '@essex/components'
import type { ICommandBarStyles } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'

const HEADER_HEIGHT = 36

export const buttonStyles = {
	wrapper: {
		padding: '10px 0px',
		height: '50%',
		backgroundColor: 'inherit',
	},
}

export function useTableHeaderColors(): Partial<CommandBarColors> {
	const theme = useTheme()
	return useMemo(
		() => ({
			background: theme.palette.white,
			border: theme.palette.neutralTertiaryAlt,
		}),
		[theme],
	)
}

export function useCommandBarStyles(): ICommandBarStyles {
	return useMemo(
		() => ({
			root: {
				height: HEADER_HEIGHT - 1,
			},
		}),
		[],
	)
}

export function useTableHeaderStyles(): ArqueroTableHeaderStyles {
	const colors = useTableHeaderColors()
	return useMemo(
		() => ({
			root: {
				height: HEADER_HEIGHT,
				borderBottom: `1px solid ${colors.border}`,
			},
		}),
		[colors],
	)
}

export function useToolPanelStyles(): ToolPanelStyles {
	const colors = useTableHeaderColors()
	return useMemo(
		() => ({
			root: {
				borderLeft: `1px solid ${colors.border}`,
			},
			header: {
				height: HEADER_HEIGHT,
				background: colors.background,
				borderBottom: `1px solid ${colors.border}`,
			},
			content: {
				padding: 10,
			},
		}),
		[colors],
	)
}
