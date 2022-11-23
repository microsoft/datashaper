/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import {
	Container,
	ExpandButton,
	icons,
	MenuContainer,
} from './FileTree.styles.js'
import type { FileTreeProps } from './FileTree.types.js'
import { FileTreeCommands } from './FileTreeCommands.js'
import { FileTreeTooltip as Tooltip } from './FileTreeTooltip.js'
import { TreeItems } from './TreeItems.js'

export const FileTree: React.FC<FileTreeProps> = memo(function FileTree({
	style,
	className,
	expanded,
	examples,
	selectedKey,
	resources,
	toggleExpanded,
	onSelect,
}) {
	const expandCollapseTooltip = expanded
		? 'Show less information'
		: 'Show more information'
	return (
		<Container style={style} className={className}>
			<MenuContainer>
				<FileTreeCommands expanded={expanded} examples={examples} />
				<TreeItems
					resources={resources}
					expanded={expanded}
					selectedRoute={selectedKey}
					onSelect={onSelect}
				/>
			</MenuContainer>
			<Tooltip content={expandCollapseTooltip}>
				<ExpandButton
					onClick={toggleExpanded}
					iconProps={expanded ? icons.collapse : icons.expand}
				/>
			</Tooltip>
		</Container>
	)
})
