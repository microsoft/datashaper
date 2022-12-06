/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { map } from 'rxjs'

import { EMPTY_ARRAY } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type {
	AppServices,
	ProfilePlugin,
	ResourceRoute,
} from '../../../types.js'
import { ResourceGroup } from '../../../types.js'

export function useResourceRoutes(
	services: AppServices,
	plugins: Map<string, ProfilePlugin>,
): ResourceRoute[][] {
	const pkg = useDataPackage()
	const observable = useMemo(
		() =>
			pkg.resources$.pipe(
				map(resources => {
					const groups = groupResources(resources, plugins)
					return groups.map(g =>
						g.map(r => makeResourceRoute(r, services, plugins)).flatMap(x => x),
					)
				}),
			),
		[pkg, services, plugins],
	)
	return useObservableState(observable, () => [])
}

function makeResourceRoute(
	resource: Resource,
	services: AppServices,
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
		menuItems: [
			...(plugin.getMenuItems?.(resource) ?? EMPTY_ARRAY),
			{
				key: 'rename',
				text: 'Rename',
				iconProps: { iconName: 'Rename' },
				onClick: () => {
					services.renameResource(resource)
				},
			},
			{
				key: 'delete',
				text: 'Delete',
				iconProps: { iconName: 'Delete' },
				onClick: () => resource.dispose(),
			},
		],
		props: { resource },
	}
	const extraRoutes = plugin?.getRoutes?.(resource, parentRoute, href)

	const children: ResourceRoute[] = extraRoutes?.children ?? []
	for (const r of resource.sources ?? EMPTY_ARRAY) {
		children.push(...makeResourceRoute(r, services, plugins, href))
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
