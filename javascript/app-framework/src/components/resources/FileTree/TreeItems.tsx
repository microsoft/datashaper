/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { TreeView } from './FileTree.styles.js'
import type { ResourceTreeData } from './FileTree.types.js'
import { useTreeItems } from './TreeItems.hooks.js'
import type { TreeItemsProps } from './TreeItems.types.js'
import { TreeNode } from './TreeNode.js'

export const TreeItems: React.FC<TreeItemsProps> = memo(function TreeItems({
	expanded,
	appLinks,
	selectedRoute,
	onSelect,
}) {
	const items = useTreeItems()
	const handleSelect = useCallback(
		(item: ResourceTreeData) => onSelect?.(item),
		[onSelect],
	)

	return (
		<TreeView>
			{items.map((i: ResourceTreeData) => (
				<TreeNode
					expanded={expanded}
					key={i.route}
					node={i}
					selected={i.route === selectedRoute}
					selectedRoute={selectedRoute}
					onSelectItem={handleSelect}
				/>
			))}
			{items.length > 0 ? <Separator /> : null}
			{appLinks.map((i: ResourceTreeData) => (
				<TreeNode
					expanded={expanded}
					key={i.route}
					node={i}
					selected={selectedRoute?.includes(i.route)}
					selectedRoute={selectedRoute}
					onSelectItem={handleSelect}
				/>
			))}
		</TreeView>
	)
})
