/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TreeItem } from '@essex/components'
import type {
	IContextualMenuItem,
	INavLink,
	INavLinkGroup,
} from '@fluentui/react'
import { useCallback,useMemo } from 'react'

import type { ResourceRoute } from '../../../types.js'

export function useTreeItems(resources: ResourceRoute[][]): TreeItem[] {
	console.log('transforming resources', resources)
	return useMemo<TreeItem[]>(() => {
		const result: TreeItem[] = []
		for (const group of resources) {
			for (const resource of group) {
				result.push(makeTreeItem(resource))
			}
		}
		return result.filter(r => r.children.length > 0)
	}, [resources])
}

export function useItemClick(
	resources: ResourceRoute[][],
	onSelect: (v: ResourceRoute) => void,
) {
	const map = useMemo(() => {
		const result = new Map<string, ResourceRoute>()
		const f = res => {
			result.set(res.href, res)
			for (const child of res.children ?? []) {
				f(child)
			}
		}
		for (const group of resources) {
			for (const resource of group) {
				f(resource)
			}
		}
		return result
	}, [resources])
	const handleItemClick = useCallback(
		(item: TreeItem) => {
			console.log('click item', item)
			const match = map.get(item.key)
			onSelect(match)
		},
		[map, onSelect],
	)
	return handleItemClick
}

function makeTreeItem(
	resource: ResourceRoute,
): INavLink & { menuItems?: IContextualMenuItem[] } {
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

export function useNavGroups(
	resources: ResourceRoute[][],
	onSelect: (v: ResourceRoute) => void,
): INavLinkGroup[] {
	return useMemo<INavLinkGroup[]>(() => {
		const result: INavLinkGroup[] = []

		for (const group of resources) {
			const links: INavLink[] = []
			for (const resource of group) {
				links.push(makeNavLink(resource, onSelect))
			}
			result.push({ links })
		}

		return result.filter(g => g.links.length > 0)
	}, [resources, onSelect])
}

function makeNavLink(
	resource: ResourceRoute,
	onSelect: (v: ResourceRoute) => void,
): INavLink & { menuItems?: IContextualMenuItem[] } {
	const numChildren = resource.children?.length ?? 0

	return {
		name: resource.title,
		iconProps: {
			iconName: resource.icon,
			styles: { root: { marginLeft: 25 } },
		},
		url: '',
		icon: numChildren > 0 ? undefined : resource.icon,
		key: resource.href,
		links: resource.children?.map(c => makeNavLink(c, onSelect)),
		menuItems: resource.menuItems,
		onClick: () => onSelect(resource),
	}
}
