/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import type React from 'react'
import { useCallback, useMemo } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type { ProfilePlugin, ResourceRoute } from '../../../types.js'
import { KNOWN_PROFILE_PLUGINS } from './DataShaperApp.constants.js'

const BREAK_WIDTH = 150
const COLLAPSED_WIDTH = 60

export function useExpandedState(
	ref: React.MutableRefObject<AllotmentHandle | null>,
): [boolean, () => void, (sizes: number[]) => void] {
	const [
		expanded,
		{ toggle: toggleExpanded, setTrue: expand, setFalse: collapse },
	] = useBoolean(true)
	const onChangeWidth = useOnChangeWidth(expanded, collapse, expand)
	const onToggle = useOnToggle(ref, expanded, toggleExpanded)
	return [expanded, onToggle, onChangeWidth]
}

function useOnToggle(
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

function useOnChangeWidth(
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
	profiles: ProfilePlugin[] | undefined,
): Map<string, ProfilePlugin> {
	const dp = useDataPackage()
	return useMemo<Map<string, ProfilePlugin>>(() => {
		const result = new Map<string, ProfilePlugin>()
		const register = (p: ProfilePlugin) => {
			result.set(p.profile, p)
			if (p.dataHandler) {
				dp.addResourceHandler(p.dataHandler)
			}
		}

		for (const p of KNOWN_PROFILE_PLUGINS) {
			register(p)
		}
		for (const p of profiles ?? EMPTY_ARRAY) {
			register(p)
		}
		return result
	}, [profiles])
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
