/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ArqueroTableHeaderStyles,
	CommandBarColors,
	TableCommandsProps,
} from '@datashaper/react'
import type { ToolPanelStyles } from '@essex/components'
import type { ICommandBarStyles, ITheme } from '@fluentui/react'
import { useTheme } from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'

const HEADER_HEIGHT = 36

export const icons = {
	settings: { iconName: 'DataManagementSettings' },
}

export const DetailsListContainer = styled.div`
	overflow: auto;
	display: flex;
	flex-direction: column;
	height: 100%;
	border-right: 1px solid
		${({ theme }: { theme: ITheme }) => theme.palette.neutralLighter};
`

export const Container = styled.div<{ collapsed: boolean }>`
	height: 100%;
	display: grid;
	grid-template-columns: ${({ collapsed }) =>
		collapsed ? '100% 0' : 'calc(100% - 280px) 280px '};
`

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

export function useTableCommandProps(): Partial<TableCommandsProps> {
	const colors = useTableHeaderColors()
	const styles = useCommandBarStyles()
	return useMemo(
		() => ({
			background: colors.background,
			commandBarProps: {
				styles,
			},
		}),
		[colors, styles],
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
				paddingLeft: 10,
				paddingRight: 10,
			},
		}),
		[colors],
	)
}
