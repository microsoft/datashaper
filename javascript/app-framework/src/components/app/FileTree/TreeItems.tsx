/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Separator } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { ResourceRoute } from '../../../types.js'
import { TreeView } from './FileTree.styles.js'
import type { TreeItemsProps } from './TreeItems.types.js'
import { TreeNode } from './TreeNode.js'

export const TreeItems: React.FC<TreeItemsProps> = memo(function TreeItems({
	resources,
	expanded,
	selectedRoute,
	onSelect,
}) {
	const handleSelect = useCallback(
		(item: ResourceRoute) => onSelect?.(item),
		[onSelect],
	)

	return (
		<TreeView>
			{resources.map((group: ResourceRoute[], index) => [
				group.map(i => {
					return (
						<TreeNode
							expanded={expanded}
							key={i.href}
							node={i}
							selected={i.href === selectedRoute}
							selectedRoute={selectedRoute}
							onSelectItem={handleSelect}
						/>
					)
				}),
				index < resources.length - 1 ? <Separator key="sep" /> : null,
			])}
		</TreeView>
	)
})
