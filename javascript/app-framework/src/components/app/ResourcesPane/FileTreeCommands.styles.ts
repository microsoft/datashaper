/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarStyles } from '@fluentui/react'
import { CommandBar, CommandBarButton, useTheme } from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'

export const CollapsedButton = styled(CommandBarButton)`
	width: inherit;
	height: calc(
		(var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
	);
`
export const Commands = styled(CommandBar)`
	.ms-CommandBar {
		padding-left: unset;
	}
`

export const collapsedButtonStyles = {
	menuIcon: { display: 'none' },
	flexContainer: { marginRight: '10px' },
}

export const icons = {
	newFile: { iconName: 'NewFolder' },
	openFile: { iconName: 'FabricOpenFolderHorizontal' },
	save: { iconName: 'Save' },
	table: { iconName: 'Table' },
	grid: { iconName: 'GridViewSmall' },
	file: { iconName: 'Page' },
	project: { iconName: 'ZipFolder' },
	openExpandedView: { iconName: 'DoubleChevronRight12' },
	closeExpandedView: { iconName: 'DoubleChevronLeft12' },
}

export function useCommandbarStyles(): ICommandBarStyles {
	const theme = useTheme()
	return useMemo(
		() => ({
			root: {
				background: theme.palette.neutralLighter,
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
			},
		}),
		[theme],
	)
}
