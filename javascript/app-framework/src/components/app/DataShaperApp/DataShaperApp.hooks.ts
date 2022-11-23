/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import { useObservableState } from 'observable-hooks'
import type React from 'react'
import { useCallback, useMemo } from 'react'
import { map } from 'rxjs'

import { EMPTY_ARRAY,emptyArray } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type {
	ProfileHandlerPlugin,
	ResourceRoute} from '../../../types.js';
import {
	ResourceGroup
} from '../../../types.js'
import { KNOWN_PROFILE_PLUGINS } from './DataShaperApp.constants.js'

const BREAK_WIDTH = 150
const COLLAPSED_WIDTH = 60

export function useOnToggle(
	ref: React.MutableRefObject<AllotmentHandle | null>,
	expanded: boolean,
	toggleExpanded: () => void,
): () => void {
	return useCallback(() => {
		if (expanded) {
			ref?.current?.resize([COLLAPSED_WIDTH])
		} else {
			ref?.current?.reset()
		}
		toggleExpanded()
	}, [ref, expanded, toggleExpanded])
}

export function useOnChangeWidth(
	expanded: boolean,
	collapse: () => void,
	expand: () => void,
): (sizes: number[]) => void {
	const changeWidth = useCallback(
		(sizes: number[]) => {
			if (sizes.length > 0) {
				const menuSize = sizes[0] as number
				if (menuSize < BREAK_WIDTH && expanded) {
					collapse()
				} else if (menuSize >= BREAK_WIDTH && !expanded) {
					expand()
				}
			}
		},
		[expanded, collapse, expand],
	)

	return useDebounceFn(
		(sizes: number[]) => {
			changeWidth(sizes)
		},
		{ wait: 200 },
	).run
}

export function useRegisteredProfiles(
	profiles: ProfileHandlerPlugin[] | undefined,
): Map<string, ProfileHandlerPlugin> {
	return useMemo<Map<string, ProfileHandlerPlugin>>(() => {
		const result = new Map<string, ProfileHandlerPlugin>()
		for (const p of KNOWN_PROFILE_PLUGINS) {
			result.set(p.profile, p)
		}
		for (const p of profiles ?? EMPTY_ARRAY) {
			result.set(p.profile, p)
		}
		return result
	}, [profiles])
}

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
	const plugin = plugins.get(resource.profile)
	if (plugin == null) {
		throw new Error('No plugin for profile: ' + resource.profile)
	}
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
		...(extraRoutes?.preItemSiblings ?? EMPTY_ARRAY),
		root,
		...(extraRoutes?.postItemSiblings ?? EMPTY_ARRAY),
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

export function useFlattened(routes: ResourceRoute[][]) {
	return useMemo(() => {
		const result: ResourceRoute[] = []
		for (const group of routes) {
			for (const r of group) {
				result.push(r)
				if (r.children != null) {
					result.push(...r.children)
				}
			}
		}
		return result
	}, [routes])
}
