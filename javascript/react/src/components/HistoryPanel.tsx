/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, useTheme } from '@fluentui/react'
import { memo } from 'react'

import { HistoryIcon } from './CustomIcons.js'
import {
	Aside,
	AsideHeader,
	icons,
	Title,
	WorkflowContainer,
} from './HistoryPanel.styles.js'
import type { HistoryPanelProps } from './HistoryPanel.types.js'

export const HistoryPanel: React.FC<HistoryPanelProps> = memo(
	function HistoryPanel({
		isCollapsed,
		toggleCollapsed,
		title = 'History',
		showStepCount,
		steps,
		titleStyle,
		children,
	}) {
		const theme = useTheme()
		return (
			<Aside isCollapsed={isCollapsed}>
				<AsideHeader isCollapsed={isCollapsed}>
					<HistoryIcon color={theme.palette.themePrimary} />
					<Title style={titleStyle} isCollapsed={isCollapsed}>
						{title} {showStepCount ? `(${steps?.length})` : null}
						<IconButton
							iconProps={icons.cancel}
							onClick={toggleCollapsed}
							ariaLabel="Close"
						/>
					</Title>
				</AsideHeader>
				<WorkflowContainer isCollapsed={isCollapsed}>
					{children}
				</WorkflowContainer>
			</Aside>
		)
	},
)
