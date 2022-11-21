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
	selectedRoute,
	plugins,
	onSelect,
}) {
	const [dataItems, appItems] = useTreeItems(plugins)
	const handleSelect = useCallback(
		(item: ResourceTreeData) => onSelect?.(item),
		[onSelect],
	)

	return (
		<TreeView>
			{dataItems.map((i: ResourceTreeData) => (
				<TreeNode
					expanded={expanded}
					key={i.href}
					node={i}
					selected={i.href === selectedRoute}
					selectedRoute={selectedRoute}
					onSelectItem={handleSelect}
				/>
			))}
			{appItems.length > 0 ? <Separator /> : null}
			{appItems.map((i: ResourceTreeData) => (
				<TreeNode
					expanded={expanded}
					key={i.href}
					node={i}
					selected={selectedRoute?.includes(i.href)}
					selectedRoute={selectedRoute}
					onSelectItem={handleSelect}
				/>
			))}
		</TreeView>
	)
})
