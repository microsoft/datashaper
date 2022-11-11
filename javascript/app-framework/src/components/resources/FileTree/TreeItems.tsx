/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator } from '@fluentui/react'
import { memo } from 'react'

import { TreeView } from './FileTree.styles.js'
import type { ResourceTreeData } from './FileTree.types.js'
import {
	useCurrentPath,
	useOnSelectItem,
	useTreeItems,
} from './TreeItems.hooks.js'
import type { TreeItemsProps } from './TreeItems.types.js'
import { TreeNode } from './TreeNode.js'

export const TreeItems: React.FC<TreeItemsProps> = memo(function TreeItems({
	expanded,
	appLinks,
}) {
	const items = useTreeItems()
	const currentPath = useCurrentPath()
	const onSelectItem = useOnSelectItem()
	return (
		<TreeView>
			{items.map((i: ResourceTreeData) => (
				<TreeNode
					expanded={expanded}
					key={i.route}
					node={i}
					selected={i.route === currentPath}
					onSelectItem={onSelectItem}
				/>
			))}
			{items.length > 0 ? <Separator /> : null}
			{appLinks.map((i: ResourceTreeData) => (
				<TreeNode
					expanded={expanded}
					key={i.route}
					node={i}
					selected={currentPath.includes(i.route)}
					onSelectItem={onSelectItem}
				/>
			))}
		</TreeView>
	)
})
