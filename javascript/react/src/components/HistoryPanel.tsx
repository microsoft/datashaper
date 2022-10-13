/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, useTheme } from '@fluentui/react'
import { memo, useMemo } from 'react'

import { HistoryIcon } from './CustomIcons.js'
import {
	Aside,
	AsideHeader,
	Title,
	WorkflowContainer,
} from './HistoryPanel.styles.js'
import type { HistoryPanelProps } from './HistoryPanel.types.js'

export const HistoryPanel: React.FC<HistoryPanelProps> = memo(
	function HistoryPanel({
		toggleCollapsed,
		title = 'History',
		showStepCount,
		steps,
		titleStyle,
		children,
	}) {
		const closeIconProps = useCloseIconProps()
		return (
			<Aside>
				<AsideHeader>
					<HistoryIcon />
					<Title style={titleStyle}>
						{title} {showStepCount ? `(${steps?.length})` : null}
						<IconButton
							iconProps={closeIconProps}
							onClick={toggleCollapsed}
							ariaLabel="Close"
						/>
					</Title>
				</AsideHeader>
				<WorkflowContainer>{children}</WorkflowContainer>
			</Aside>
		)
	},
)

function useCloseIconProps() {
	const theme = useTheme()
	return useMemo(
		() => ({
			iconName: 'Cancel',
			styles: {
				root: {
					color: theme.palette.neutralPrimary,
				},
			},
		}),
		[theme],
	)
}
