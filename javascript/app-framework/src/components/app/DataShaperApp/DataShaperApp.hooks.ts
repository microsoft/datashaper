/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import { useBoolean } from '@fluentui/react-hooks'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type {
	AppServices,
	ProfilePlugin,
	ResourceRoute,
} from '../../../types.js'
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
	api: AppServices,
	profiles: ProfilePlugin[] | undefined,
): Map<string, ProfilePlugin> {
	const dp = useDataPackage()
	return useMemo<Map<string, ProfilePlugin>>(() => {
		const allPlugins = [...KNOWN_PROFILE_PLUGINS, ...(profiles ?? EMPTY_ARRAY)]
		const result = new Map<string, ProfilePlugin>()
		for (const p of allPlugins) {
			p.initialize?.(api)
			result.set(p.profile, p)
			// add data-handlers to the workflow package
			if (p.dataHandler) {
				dp.addResourceHandler(p.dataHandler)
			}
		}
		return result
	}, [dp, api, profiles])
}

export function useFlattened(routes: ResourceRoute[][]): ResourceRoute[] {
	return useMemo<ResourceRoute[]>(() => {
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

export function useAppServices(): {
	api: AppServices
	rename: {
		resource: Resource | undefined
		isOpen: boolean
		onDismiss: () => void
		onAccept: (name: string | undefined) => void
	}
} {
	const [isRenameOpen, { setTrue: showRename, setFalse: hideRename }] =
		useBoolean(false)
	const [renameResource, setRenameResource] = useState<Resource | undefined>()
	const [acceptRename, setAcceptRename] = useState<
		(value: string | undefined) => void
	>(() => null)
	const [dismissRename, setDismissRename] = useState<() => void>(() => null)

	const api = useMemo<AppServices>(() => {
		return {
			/**
			 * Initiates a resource rename
			 * @param resource - The resource to renamew
			 * @returns A promise that resolves to the new name of the resource
			 */
			renameResource: (resource: Resource) => {
				setRenameResource(resource)
				showRename()
				return new Promise((resolve, reject) => {
					setAcceptRename((name: string | undefined) => {
						hideRename()
						if (name != null) {
							resource.name = name
							resolve(name)
						}
					})
					setDismissRename(() => {
						hideRename()
						reject('cancelled')
					})
				})
			},
		}
	}, [showRename, setRenameResource])

	return useMemo(
		() => ({
			api,
			rename: {
				resource: renameResource,
				isOpen: isRenameOpen,
				onDismiss: dismissRename,
				onAccept: acceptRename,
			},
		}),
		[api, renameResource],
	)
}