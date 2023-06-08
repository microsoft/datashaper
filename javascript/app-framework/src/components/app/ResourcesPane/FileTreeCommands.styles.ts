/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICommandBarStyles } from '@fluentui/react'
import { CommandBar, CommandBarButton, useTheme } from '@fluentui/react'
import { useMemo } from 'react'
import styled from 'styled-components'

// override the command background, which does not update properly in fluent after first render
export const Commands = styled(CommandBar as any)`
	.ms-CommandBar {
		padding-left: unset;
	}
	.ms-Button {
		background: ${({ theme }) => theme.palette.neutralLighter};
	}
`

export const CollapsedCommands = styled.div`
	background: ${({ theme }) => theme.palette.neutralLighter};
`

export const CollapsedButton = styled(CommandBarButton as any)`
	width: inherit;
`

export const collapsedButtonStyles = {
	root: {
		background: 'transparent',
		minWidth: 'unset',
	},
	menuIcon: { display: 'none' },
	flexContainer: {
		// standard fluent button height
		height: 32,
	},
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
			},
		}),
		[theme],
	)
}
