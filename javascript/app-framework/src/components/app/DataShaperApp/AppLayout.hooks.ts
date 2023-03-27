/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ProfileHandler, Resource } from '@datashaper/workflow'
import { useBoolean, useConst } from '@fluentui/react-hooks'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import { defaultAppProfiles } from '../../../profiles/index.js'
import type {
	AppServices,
	AppProfile,
	ResourceRoute,
	ResourceRouteGroup,
} from '../../../types.js'
import { PANE_BREAK_WIDTH, PANE_COLLAPSED_SIZE } from './AppLayout.styles.js'

function useKnownAppProfiles(): AppProfile[] {
	return useConst(() => defaultAppProfiles() as AppProfile<any, any>[])
}

export function useNarrowExpandCollapseState(
	initialExpanded: boolean,
	ref: React.MutableRefObject<AllotmentHandle | null>,
): [boolean, () => void, (sizes: number[]) => void] {
	const [
		expanded,
		{ toggle: toggleExpanded, setTrue: expand, setFalse: collapse },
	] = useBoolean(initialExpanded)
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
			ref?.current?.resize([PANE_COLLAPSED_SIZE])
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
				if (menuSize < PANE_BREAK_WIDTH && expanded) {
					collapse()
				} else if (menuSize >= PANE_BREAK_WIDTH && !expanded) {
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
	profiles: AppProfile[] | undefined,
): Map<string, AppProfile> {
	const dp = useDataPackage()
	const knownProfiles = useKnownAppProfiles()

	return useMemo<Map<string, AppProfile>>(() => {
		const allProfiles: AppProfile[] = [
			...knownProfiles,
			...(profiles ?? EMPTY_ARRAY),
		]
		const result = new Map<string, AppProfile>()
		for (const p of allProfiles) {
			p.initialize?.({ api, dataPackage: dp })
			result.set(p.profile, p)
			dp.addResourceHandler(p as ProfileHandler<Resource>)
		}
		return result
	}, [dp, api, profiles, knownProfiles])
}

/**
 * Flatten the grouped routes and all children into a single array for lookups.
 * @param routes
 * @returns
 */
export function useFlattened(routes: ResourceRouteGroup[]): ResourceRoute[] {
	// start with a flat list of the roots from each group,
	// then send to the recursive compilation.
	return useMemo<ResourceRoute[]>(
		() => flattenRoutes(routes.flatMap((g) => g.resources)),
		[routes],
	)
}

function flattenRoutes(resources: ResourceRoute[]) {
	const result: ResourceRoute[] = []
	for (const r of resources) {
		result.push(r)
		if (r.children != null) {
			result.push(...flattenRoutes(r.children))
		}
	}
	return result
}

export function useAppServices(defaultHelp: string): {
	api: AppServices
	rename: {
		resource: Resource | undefined
		isOpen: boolean
		onDismiss: () => void
		onAccept: (name: string | undefined) => void
	}
	help: {
		currentHelp: string | undefined
		helpContent: Record<string, string>
		onInitializeHelp: (help: Record<string, string>) => void
	}
} {
	const dp = useDataPackage()
	const [isRenameOpen, { setTrue: showRename, setFalse: hideRename }] =
		useBoolean(false)
	const [renameTarget, setRenameTarget] = useState<Resource | undefined>()
	const [acceptRename, setAcceptRename] = useState<{
		handle: (value: string | undefined) => void
	}>({ handle: () => null })
	const [dismissRename, setDismissRename] = useState<{ handle: () => void }>({
		handle: () => null,
	})

	const [helpKey, onRequestHelp] = useState<string | undefined>(defaultHelp)
	const [helpIndex, onInitializeHelp] = useState<Record<string, string>>({})

	const api = useMemo<AppServices>(() => {
		return {
			/**
			 * Initiates a resource rename
			 * @param resource - The resource to renamew
			 * @returns A promise that resolves to the new name of the resource
			 */
			renameResource: (resource: Resource) => {
				setRenameTarget(resource)
				showRename()
				return new Promise((resolve, reject) => {
					setAcceptRename({
						handle: (name: string | undefined) => {
							if (name != null) {
								const suggestedName = dp.suggestResourceName(name)
								resource.name = suggestedName
								if (name !== suggestedName) {
									resource.title = name
								}
								resolve(name)
							}
							hideRename()
						},
					})
					setDismissRename({
						handle: () => {
							hideRename()
							reject('cancelled')
						},
					})
				})
			},
			requestHelp: (key: string) => onRequestHelp(key),
		}
	}, [dp, showRename, setRenameTarget, hideRename])

	return useMemo(
		() => ({
			api,
			rename: {
				resource: renameTarget,
				isOpen: isRenameOpen,
				onDismiss: dismissRename.handle,
				onAccept: acceptRename.handle,
			},
			help: {
				currentHelp: helpKey,
				onInitializeHelp,
				helpContent: helpIndex,
			},
		}),
		[
			api,
			renameTarget,
			dismissRename.handle,
			acceptRename.handle,
			isRenameOpen,
			helpKey,
			helpIndex,
		],
	)
}

/**
 * Populate the help index once the profiles are instantiated.
 * @param profiles
 * @param onInitializeHelp
 */
export function useRegisterProfileHelp(
	profiles: Map<string, AppProfile>,
	onInitializeHelp: (help: Record<string, string>) => void,
): void {
	useEffect(() => {
		let help: Record<string, string> = {}
		for (const profile of profiles.values()) {
			const profileHelp = profile?.getHelp?.()
			if (profileHelp != null) {
				// note that this will quietly overwrite any duplicate keys
				help = { ...help, ...profileHelp }
			}
		}
		onInitializeHelp(help)
	}, [profiles, onInitializeHelp])
}
