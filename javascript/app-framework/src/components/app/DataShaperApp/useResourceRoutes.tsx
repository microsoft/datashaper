/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource, ResourceReference } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { map } from 'rxjs'

import { EMPTY_ARRAY } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type {
	AppServices,
	ProfilePlugin,
	ResourceRoute,
	ResourceRouteGroup,
} from '../../../types.js'
import { ResourceGroupType } from '../../../types.js'

/**
 * Get groups of resource routes for the application
 *
 * @param services - The application services
 * @param plugins - Profile plugins
 * @returns A list of resource route groups
 */
export function useResourceRoutes(
	services: AppServices,
	plugins: Map<string, ProfilePlugin>,
): ResourceRouteGroup[] {
	const pkg = useDataPackage()
	const observable = useMemo(
		() =>
			pkg.resources$.pipe(
				map((resources) => {
					const hrefs = getResourceHrefs(resources)
					const grouped = groupResources(resources, plugins)
					const groups: ResourceRouteGroup[] = []
					grouped.forEach((resources, type) => {
						groups.push({
							type,
							resources: resources
								.map((r) => makeResourceRoute(r, services, plugins, hrefs))
								.flatMap((x) => x),
						})
					})
					return groups
				}),
			),
		[pkg, services, plugins],
	)
	return useObservableState(observable, () => [])
}

function getResourceHrefs(
	resources: Resource[],
	current?: Map<string, string>,
	parentRoute = '/resource',
): Map<string, string> {
	const result = current ?? new Map<string, string>()

	resources.forEach((r) => {
		if (!r.isReference()) {
			const href = `${parentRoute}/${r.name}`
			result.set(r.name, href)
			getResourceHrefs(r.sources, result, href)
		}
	})
	return result
}

function makeResourceRoute(
	resource: Resource,
	services: AppServices,
	plugins: Map<string, ProfilePlugin>,
	hrefs: Map<string, string>,
): ResourceRoute[] {
	if (resource.isReference()) {
		const ref = resource as ResourceReference
		const target = ref.target
		const href = target && hrefs.get(target.name)
		if (target) {
			const route: ResourceRoute = {
				title: target.title ?? target.name,
				href,
				icon: 'Link',
			}
			return [route]
		}
	}
	if (!resource.profile) {
		console.warn('no profile for resource', resource)
		return []
	}
	const plugin = plugins.get(resource.profile)!
	const href = hrefs.get(resource.name)
	const root: ResourceRoute = {
		href,
		title: resource.title ?? resource.name,
		icon: plugin.iconName,
		renderer: plugin.renderer,
		menuItems: [
			...(plugin.getMenuItems?.(resource) ?? EMPTY_ARRAY),
			{
				key: 'rename',
				text: 'Rename',
				iconProps: { iconName: 'Rename' },
				onClick: () => services.renameResource(resource),
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
	const extraRoutes = plugin?.getRoutes?.(resource, hrefs)

	const children: ResourceRoute[] = extraRoutes?.children ?? []
	for (const r of resource.sources ?? EMPTY_ARRAY) {
		children.push(...makeResourceRoute(r, services, plugins, hrefs))
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
): Map<ResourceGroupType, Resource[]> {
	const map = new Map<ResourceGroupType, Resource[]>([
		[ResourceGroupType.Data, []],
		[ResourceGroupType.Apps, []],
	])
	for (const r of resources) {
		if (r.profile != null) {
			const plugin = plugins.get(r.profile)
			if (plugin?.group === ResourceGroupType.Data) {
				map.get(ResourceGroupType.Data)!.push(r)
			} else {
				map.get(ResourceGroupType.Apps)!.push(r)
			}
		}
	}
	return map
}
