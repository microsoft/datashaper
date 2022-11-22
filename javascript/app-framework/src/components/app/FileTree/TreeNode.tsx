/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback } from 'react'

import { Tooltip } from '../Tooltip/index.js'
import { ItemIcon, TreeItem } from './FileTree.styles.js'
import type { TreeNodeProps } from './TreeNode.types.js'

export const TreeNode: React.FC<TreeNodeProps> = memo(function TreeNode({
	node,
	selected,
	onSelectItem,
	selectedRoute,
	expanded,
}) {
	const treeItemStyle = { textAlign: expanded ? 'inheric' : 'center' }
	const itemIconStyle = { marginRight: expanded ? '10px' : '23px' }

	const children = node.children?.map(child => {
		const selected = child.href === selectedRoute
		return (
			<TreeNode
				expanded={expanded}
				key={child.href}
				node={child}
				selected={selected}
				onSelectItem={onSelectItem}
			/>
		)
	})
	const handleOnClick = useCallback(
		(e: Event) => {
			e.stopPropagation()
			onSelectItem(node)
		},
		[onSelectItem, node],
	)
	return (
		<TreeItem
			title={expanded ? node.title : ''}
			onClick={handleOnClick}
			selected={selected}
			style={treeItemStyle}
		>
			<Tooltip content={node.title} calloutProps={{ hidden: expanded }}>
				<ItemIcon style={itemIconStyle} iconName={node.icon} />
				{expanded ? node.title : ''}
			</Tooltip>
			{expanded ? children : null}
		</TreeItem>
	)
})
