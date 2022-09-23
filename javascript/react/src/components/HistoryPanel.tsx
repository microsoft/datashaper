/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { useThematic } from '@thematic/react'
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
import { ManageWorkflow } from './ManageWorkflow.js'

export const HistoryPanel: React.FC<HistoryPanelProps> = memo(
	function HistoryPanel({
		isCollapsed,
		toggleCollapsed,
		setSelectedTableId,
		workflow,
	}) {
		const theme = useThematic()
		return (
			<Aside isCollapsed={isCollapsed}>
				<AsideHeader isCollapsed={isCollapsed}>
					<HistoryIcon color={theme.application().accent().hex()} />
					<Title isCollapsed={isCollapsed}>
						History ({workflow?.steps?.length || 0})
						<IconButton
							iconProps={icons.cancel}
							onClick={toggleCollapsed}
							ariaLabel="Close"
						/>
					</Title>
				</AsideHeader>
				<WorkflowContainer isCollapsed={isCollapsed}>
					<ManageWorkflow
						workflow={workflow}
						onSelect={setSelectedTableId}
						historyView={true}
					/>
				</WorkflowContainer>
			</Aside>
		)
	},
)
