/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TreeGroup, TreeItem } from '@essex/components'
import { useMemo } from 'react'

import type { ResourceRoute, ResourceRouteGroup } from '../../../types.js'
import { ResourceGroupType } from '../../../types.js'

/**
 * Extract the grouping instructions for the Tree component.
 * @param groups
 * @returns
 */
export function useTreeGroups(groups: ResourceRouteGroup[]): TreeGroup[] {
	return useMemo(
		() => groups.map(g => ({ key: g.type, text: groupName(g) })),
		[groups],
	)
}

function groupName(group: ResourceRouteGroup) {
	return group.type === ResourceGroupType.Data ? 'Data files' : 'Analysis apps'
}

/**
 * Extract a flat list of TreeItems for the Tree, with each assigned to a group
 * that aligns with the grouping instructions.
 * @param groups
 * @returns
 */
export function useTreeItems(
	groups: ResourceRouteGroup[],
	onSelect: (v: ResourceRoute) => void,
): TreeGroup[] {
	return useMemo(
		() =>
			groups.flatMap(group =>
				group.resources.map(resource =>
					makeTreeItem(resource, group.type, onSelect),
				),
			),
		[groups, onSelect],
	)
}

function makeTreeItem(
	resource: ResourceRoute,
	group?: ResourceGroupType,
	onSelect?: (v: ResourceRoute) => void,
): TreeItem {
	const numChildren = resource.children?.length ?? 0
	return {
		key: resource.href,
		text: resource.title,
		iconName: resource.icon,
		group,
		children:
			numChildren > 0
				? resource.children?.map(c => makeTreeItem(c, group, onSelect))
				: undefined,
		menuItems: resource.menuItems,
		onClick: () => onSelect?.(resource),
	}
}
