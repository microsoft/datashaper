/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { FileTreeCommands } from './FileTreeCommands.js'
import { FileTreeTooltip as Tooltip } from './FileTreeTooltip.js'
import {
	Container,
	ExpandButton,
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
	}) {
		const expandCollapseTooltip = expanded
			? 'Show less information'
			: 'Show more information'
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
				<Tooltip content={expandCollapseTooltip}>
					<ExpandButton
						onClick={onToggleExpanded}
						iconProps={expanded ? icons.collapse : icons.expand}
					/>
				</Tooltip>
			</Container>
		)
	},
)
