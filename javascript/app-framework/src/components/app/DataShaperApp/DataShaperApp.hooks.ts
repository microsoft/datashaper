/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataPackage, Resource } from '@datashaper/workflow'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type { GeneratedRoute, ProfileHandlerPlugin } from '../../../types.js'
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

export function useDataPackageResourceRoutes(
	plugins: Map<string, ProfileHandlerPlugin>,
): GeneratedRoute[] {
	const dp = useDataPackage()
	const [result, setResult] = useState<GeneratedRoute[]>([])
	useEffect(() => {
		setResult(getRoutes(dp, plugins))
		return dp.onChange(() => setResult(getRoutes(dp, plugins)))
	}, [dp, plugins])
	return result
}

function getRoutes(
	dp: DataPackage,
	plugins: Map<string, ProfileHandlerPlugin>,
): GeneratedRoute[] {
	const result: GeneratedRoute[] = []
	addSources(result, dp.resources, plugins)
	return result
}

function addSources(
	result: GeneratedRoute[],
	resources: Resource[],
	plugins: Map<string, ProfileHandlerPlugin>,
	root = '/resource',
) {
	for (const resource of resources) {
		const plugin = plugins.get(resource.profile)

		if (plugin != null) {
			const resourceRoute = {
				path: `${root}/${resource.name}`,
				renderer: plugin.renderer,
				props: { resource },
			}
			const extraRoutes = plugin.onGenerateRoutes?.(resource, root)
			result.push(resourceRoute, ...(extraRoutes ?? EMPTY_ARRAY))
		} else {
			console.error('could not find renderer for profile', resource.profile)
		}
		/** Descend into child resources */
		const children = (resource as any).sources
		if (children?.length > 0) {
			addSources(result, children, plugins, `${root}/${resource.name}`)
		}
	}
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
