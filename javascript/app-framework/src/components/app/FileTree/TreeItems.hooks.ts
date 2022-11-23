/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { map } from 'rxjs'

import { emptyArray } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type {
	ProfileHandlerPlugin,
	ResourceRoute} from '../../../types.js';
import {
	ResourceGroup
} from '../../../types.js'

export function useResourceRoutes(
	plugins: Map<string, ProfileHandlerPlugin>,
): ResourceRoute[][] {
	const pkg = useDataPackage()
	const observable = useMemo(
		() =>
			pkg.resources$.pipe(
				map(resources => {
					const groups = groupResources(resources, plugins)
					return groups.map(g =>
						g.map(r => getFileTreeItem(r, plugins)).flatMap(x => x),
					)
				}),
			),
		[pkg, plugins],
	)
	return useObservableState(observable, () => [])
}

function getFileTreeItem(
	resource: Resource,
	plugins: Map<string, ProfileHandlerPlugin>,
	parentRoute = '/resource',
): ResourceRoute[] {
	const plugin = plugins.get(resource.profile)!
	const href = `${parentRoute}/${resource.name}`
	const root: ResourceRoute = {
		href,
		title: resource.name,
		icon: plugin.iconName,
		renderer: plugin.renderer,
		props: { resource },
	}
	const extraRoutes = plugin?.onGenerateRoutes?.(resource, parentRoute, href)

	const children: ResourceRoute[] = extraRoutes?.children ?? []
	for (const r of resource.sources ?? emptyArray) {
		children.push(...getFileTreeItem(r, plugins, href))
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
	plugins: Map<string, ProfileHandlerPlugin>,
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
