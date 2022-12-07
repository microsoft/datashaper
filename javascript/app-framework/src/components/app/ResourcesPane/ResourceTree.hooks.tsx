/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TreeItem } from '@essex/components'
import { useCallback, useMemo } from 'react'

import type { ResourceRoute } from '../../../types.js'

export function useTreeGroups(groups: ResourceRoute[][]): TreeItem[][] {
	return useMemo(() => {
		return groups.map(group => {
			const result: TreeItem[] = []
			for (const resource of group) {
				result.push(makeTreeItem(resource))
			}
			return result
		})
	}, [groups])
}

// this is a temporary workaround for the fact that the Tree component
// doesn't support individual onClicks so we have to look up the item
export function useItemClick(
	resources: ResourceRoute[][],
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
			for (const resource of group) {
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

function makeTreeItem(resource: ResourceRoute): TreeItem {
	const numChildren = resource.children?.length ?? 0
	return {
		key: resource.href,
		text: resource.title,
		iconName: resource.icon,
		children:
			numChildren > 0
				? resource.children?.map(c => makeTreeItem(c))
				: undefined,
		menuItems: resource.menuItems,
	}
}
