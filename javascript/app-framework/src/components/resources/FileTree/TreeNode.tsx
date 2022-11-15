/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DirectionalHint } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { Tooltip } from '../../util/index.js'
import { ItemIcon, tooltipStyles, TreeItem } from './FileTree.styles.js'
import type { TreeNodeProps } from './TreeNode.types.js'

export const TreeNode: React.FC<TreeNodeProps> = memo(function TreeNode({
	node,
	selected,
	onSelectItem,
	selectedRoute,
	expanded,
}) {
	const treeItemStyle = { textAlign: !expanded ? 'center' : 'inherit' }
	const itemIconStyle = { marginRight: expanded ? '10px' : '23px' }

	const children = node.children?.map(child => {
		const selected = child.route === selectedRoute
		return (
			<TreeNode
				expanded={expanded}
				key={child.route}
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
		<>
			<TreeItem
				key={node.route}
				title={expanded ? node.title : ''}
				onClick={handleOnClick}
				selected={selected}
				style={treeItemStyle}
			>
				<Tooltip
					directionalHint={DirectionalHint.rightCenter}
					styles={tooltipStyles}
					content={node.title}
					calloutProps={{ hidden: expanded }}
				>
					<ItemIcon style={itemIconStyle} iconName={node.icon} />
					{expanded ? node.title : ''}
				</Tooltip>
				{expanded ? children : null}
			</TreeItem>
			{!expanded ? children : null}
		</>
	)
})
