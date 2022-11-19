/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import merge from 'lodash-es/merge.js'
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
	toggleExpanded,
	examples,
	selectedKey,
	onSelect,
}) {
	const expandCollapseTooltip = expanded
		? 'Show less information'
		: 'Show more information'
	return (
		<Container style={merge({ width: 'auto' }, style)} className={className}>
			<MenuContainer>
				<FileTreeCommands expanded={expanded} examples={examples} />
				<TreeItems
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
