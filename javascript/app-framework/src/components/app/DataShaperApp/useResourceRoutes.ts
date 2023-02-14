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
	AppProfile,
	ResourceRoute,
	ResourceRouteGroup,
	ResourceSlotFieldWell,
	ResourceSlot,
} from '../../../types.js'
import { ResourceGroupType } from '../../../types.js'

/**
 * Get groups of resource routes for the application
 *
 * @param services - The application services
 * @param profiles
 * @returns A list of resource route groups
 */
export function useResourceRoutes(
	services: AppServices,
	profiles: Map<string, AppProfile>,
): ResourceRouteGroup[] {
	const pkg = useDataPackage()
	console.log('using resource routes', services, profiles)
	const observable = useMemo(
		() =>
			pkg.resources$.pipe(
				map((resources) => {
					console.log('pkg resources', resources)
					const hrefs = getResourceHrefs(resources)
					const grouped = groupResources(resources, profiles)
					const groups: ResourceRouteGroup[] = []
					grouped.forEach((resources, type) => {
						groups.push({
							type,
							resources: resources.map((r) =>
								makeResourceRoute(r, services, profiles, resources, hrefs),
							),
						})
					})
					return groups
				}),
			),
		[pkg, services, profiles],
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
	profiles: Map<string, AppProfile>,
	resources: Resource[],
	hrefs: Map<string, string>,
): ResourceRoute {
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
			return route
		}
	}
	if (!resource.profile) {
		console.warn('no profile for resource', resource)
		// TODO:  this should return a raw text renderer
		return {} as ResourceRoute
	}
	const profile = profiles.get(resource.profile)!
	const href = hrefs.get(resource.name)
	const root: ResourceRoute = {
		href,
		title: resource.title ?? resource.name,
		icon: profile.iconName,
		renderer: profile.renderer,
		menuItems: [
			...(profile.getMenuItems?.(resource) ?? EMPTY_ARRAY),
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
		fieldWells: makeFieldWells(resources, profile.getSlots?.(resource)),
		props: { resource },
		children: (resource.sources ?? EMPTY_ARRAY).map((r) =>
			makeResourceRoute(r, services, profiles, resources, hrefs),
		),
	}

	return root
}

function makeFieldWells(
	/**
	 * The list of all resources in the package, which we can filter per slot to get the list of eligible resources
	 */
	resources: Resource[],
	slots?: ResourceSlot[],
): ResourceSlotFieldWell[] | undefined {
	return slots?.map((slot) => {
		const options = resources
			.filter((resource) => resource.profile === slot.profile)
			.map((resource) => ({
				key: resource.name,
				text: resource.title ?? resource.name,
			}))
		return {
			slot,
			options,
		} as ResourceSlotFieldWell
	})
}

function groupResources(
	resources: Resource[],
	profiles: Map<string, AppProfile>,
): Map<ResourceGroupType, Resource[]> {
	const map = new Map<ResourceGroupType, Resource[]>([
		[ResourceGroupType.Data, []],
		[ResourceGroupType.Apps, []],
	])
	for (const r of resources) {
		if (r.profile != null) {
			const profile = profiles.get(r.profile)
			if (profile?.group === ResourceGroupType.Data) {
				map.get(ResourceGroupType.Data)!.push(r)
			} else {
				map.get(ResourceGroupType.Apps)!.push(r)
			}
		}
	}
	return map
}
