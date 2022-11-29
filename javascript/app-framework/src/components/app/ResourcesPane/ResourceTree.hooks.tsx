/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import type {
	IContextualMenuItem,
	INavLink,
	INavLinkGroup,
} from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { map } from 'rxjs'

import { emptyArray } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type { ProfilePlugin, ResourceRoute } from '../../../types.js'
import { ResourceGroup } from '../../../types.js'

export function useResourceRoutes(
	plugins: Map<string, ProfilePlugin>,
): ResourceRoute[][] {
	const pkg = useDataPackage()
	const observable = useMemo(
		() =>
			pkg.resources$.pipe(
				map(resources => {
					const groups = groupResources(resources, plugins)
					return groups.map(g =>
						g.map(r => makeResourceRoute(r, plugins)).flatMap(x => x),
					)
				}),
			),
		[pkg, plugins],
	)
	return useObservableState(observable, () => [])
}

function makeResourceRoute(
	resource: Resource,
	plugins: Map<string, ProfilePlugin>,
	parentRoute = '/resource',
): ResourceRoute[] {
	const plugin = plugins.get(resource.profile)!
	const href = `${parentRoute}/${resource.name}`
	const root: ResourceRoute = {
		href,
		title: resource.name,
		icon: plugin.iconName,
		renderer: plugin.renderer,
		menuItems: plugin.onGetMenuItems?.(resource),
		props: { resource },
	}
	const extraRoutes = plugin?.onGetRoutes?.(resource, parentRoute, href)

	const children: ResourceRoute[] = extraRoutes?.children ?? []
	for (const r of resource.sources ?? emptyArray) {
		children.push(...makeResourceRoute(r, plugins, href))
	}

	root.children = children
	return [
		...(extraRoutes?.preItemSiblings ?? []),
		root,
		...(extraRoutes?.postItemSiblings ?? []),
	]
}

function groupResources(
	resources: Resource[],
	plugins: Map<string, ProfilePlugin>,
): Resource[][] {
	const dataResources: Resource[] = []
	const appResources: Resource[] = []
	for (const r of resources) {
		const plugin = plugins.get(r.profile)
		if (plugin?.group === ResourceGroup.Data) {
			dataResources.push(r)
		} else {
			appResources.push(r)
		}
	}
	return [dataResources, appResources]
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

		return result
	}, [resources])
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
