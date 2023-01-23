/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'

import { FileTreeCommands } from './FileTreeCommands.js'
import { FileTreeTooltip as Tooltip } from './FileTreeTooltip.js'
import { HelpPanel } from './HelpPanel.js'
import {
	Container,
	FooterMenu,
	HelpContainer,
	icons,
	MenuContainer,
} from './ResourcesPane.styles.js'
import type { ResourcesPaneProps } from './ResourcesPane.types.js'
import { ResourceTree } from './ResourceTree.js'
export const ResourcesPane: React.FC<ResourcesPaneProps> = memo(
	function ResourcesPane({
		style,
		className,
		expanded,
		examples,
		selectedKey,
		resources,
		plugins,
		onToggleExpanded,
		onSelect,
		currentHelp,
		helpContent,
	}) {
		const expandCollapseTooltip = expanded
			? 'Show less information'
			: 'Show more information'
		const [helpVisible, { toggle: onToggleHelp }] = useBoolean(false)
		const helpTooltip = helpVisible
			? 'Hide interactive guidance'
			: 'Show interactive guidance'
		return (
			<Container style={style} className={className}>
				<MenuContainer>
					<FileTreeCommands
						expanded={expanded}
						examples={examples}
						plugins={plugins}
					/>
					<ResourceTree
						resources={resources}
						expanded={expanded}
						selectedRoute={selectedKey}
						onSelect={onSelect}
					/>
				</MenuContainer>

				{expanded && helpVisible && (
					<HelpContainer>
						<HelpPanel
							currentHelp={currentHelp}
							helpContent={helpContent}
							onToggleExpanded={onToggleHelp}
						/>
					</HelpContainer>
				)}
				<FooterMenu>
					{expanded && (
						<Tooltip content={helpTooltip} styles={tooltipStyles}>
							<IconButton onClick={onToggleHelp} iconProps={icons.help} />
						</Tooltip>
					)}
					<Tooltip content={expandCollapseTooltip} styles={tooltipStyles}>
						<IconButton
							onClick={onToggleExpanded}
							iconProps={expanded ? icons.collapse : icons.expand}
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
