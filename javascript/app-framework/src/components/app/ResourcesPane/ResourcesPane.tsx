/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { Allotment } from 'allotment'
import { memo } from 'react'

import { FileTreeCommands } from './FileTreeCommands.js'
import { FileTreeTooltip as Tooltip } from './FileTreeTooltip.js'
import { HelpPanel } from './HelpPanel.js'
import {
	Container,
	FooterMenu,
	HelpContainer,
	icons,
	TreeContainer,
} from './ResourcesPane.styles.js'
import type { ResourcesPaneProps } from './ResourcesPane.types.js'
import { ResourceTree } from './ResourceTree.js'
export const ResourcesPane: React.FC<ResourcesPaneProps> = memo(
	function ResourcesPane({
		style,
		className,
		narrow,
		examples,
		selectedKey,
		resources,
		profiles,
		onToggleNarrow,
		onSelect,
		currentHelp,
		helpContent,
	}) {
		const expandCollapseTooltip = narrow
			? 'Show more information'
			: 'Show less information'
		const [helpVisible, { toggle: onToggleHelp }] = useBoolean(false)
		const helpTooltip = helpVisible
			? 'Hide interactive guidance'
			: 'Show interactive guidance'
		return (
			<Container style={style} className={className}>
				<FileTreeCommands
					narrow={narrow}
					examples={examples}
					profiles={profiles}
				/>
				<Allotment vertical>
					<Allotment.Pane>
						<TreeContainer>
							<ResourceTree
								resources={resources}
								narrow={narrow}
								selectedRoute={selectedKey}
								onSelect={onSelect}
							/>
						</TreeContainer>
					</Allotment.Pane>
					{!narrow && helpVisible && (
						<Allotment.Pane>
							<HelpContainer>
								<HelpPanel
									currentHelp={currentHelp}
									helpContent={helpContent}
									onToggleExpanded={onToggleHelp}
								/>
							</HelpContainer>
						</Allotment.Pane>
					)}
				</Allotment>
				<FooterMenu>
					{!narrow && (
						<Tooltip content={helpTooltip} styles={tooltipStyles}>
							<IconButton onClick={onToggleHelp} iconProps={icons.help} />
						</Tooltip>
					)}
					<Tooltip content={expandCollapseTooltip} styles={tooltipStyles}>
						<IconButton
							onClick={onToggleNarrow}
							iconProps={narrow ? icons.expand : icons.collapse}
						/>
					</Tooltip>
				</FooterMenu>
			</Container>
		)
	},
)

const tooltipStyles = {
	root: {
		width: 32,
	},
}
