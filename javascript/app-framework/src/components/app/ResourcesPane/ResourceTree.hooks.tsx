/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TreeGroup, TreeItem } from '@essex/components'
import { useCallback, useMemo } from 'react'

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
export function useTreeItems(groups: ResourceRouteGroup[]): TreeGroup[] {
	return useMemo(
		() =>
			groups.flatMap(group =>
				group.resources.map(resource => makeTreeItem(resource, group.type)),
			),
		[groups],
	)
}

// this is a temporary workaround for the fact that the Tree component
// doesn't support individual onClicks so we have to look up the item
export function useItemClick(
	resources: ResourceRouteGroup[],
	onSelect: (v: ResourceRoute) => void,
): (item: TreeItem) => void {
	const map = useMemo(() => {
		const result = new Map<string, ResourceRoute>()
		const walk = (res: ResourceRoute) => {
			result.set(res.href, res)
			for (const child of res.children ?? []) {
				walk(child)
			}
		}
		for (const group of resources) {
			for (const resource of group.resources) {
				walk(resource)
			}
		}
		return result
	}, [resources])
	return useCallback(
		(item: TreeItem) => {
			const match = map.get(item.key)
			onSelect(match!)
		},
		[map, onSelect],
	)
}

function makeTreeItem(
	resource: ResourceRoute,
	group?: ResourceGroupType,
): TreeItem {
	const numChildren = resource.children?.length ?? 0
	return {
		key: resource.href,
		text: resource.title,
		iconName: resource.icon,
		group,
		children:
			numChildren > 0
				? resource.children?.map(c => makeTreeItem(c, group))
				: undefined,
		menuItems: resource.menuItems,
	}
}
