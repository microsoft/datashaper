/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { type Resource, JsonDataHandler } from '@datashaper/workflow'
import { useBoolean, useConst } from '@fluentui/react-hooks'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import type React from 'react'
import { useCallback, useMemo, useState } from 'react'

import { EMPTY_ARRAY } from '../../../empty.js'
import { useDataPackage } from '../../../hooks/useDataPackage.js'
import { CodebookProfile } from '../../../profiles/CodebookProfile.js'
import { DataTableProfile } from '../../../profiles/DataTableProfile.js'
import { TableBundleProfile } from '../../../profiles/TableBundleProfile.js'
import { WorkflowProfile } from '../../../profiles/WorkflowProfile.js'
import type {
	AppServices,
	ProfilePlugin,
	ResourceRoute,
	ResourceRouteGroup,
} from '../../../types.js'

const BREAK_WIDTH = 150
const COLLAPSED_WIDTH = 60

export function useKnownProfilePlugins(): ProfilePlugin[] {
	return useConst(() => {
		const datatablePlugin = new DataTableProfile()
		const codebookPlugin = new CodebookProfile()
		const workflowPlugin = new WorkflowProfile()
		const tableBundlePlugin = new TableBundleProfile(
			datatablePlugin,
			codebookPlugin,
			workflowPlugin,
		)

		return [datatablePlugin, codebookPlugin, tableBundlePlugin, workflowPlugin]
	})
}

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
	const knownProfiles = useKnownProfilePlugins()

	return useMemo<Map<string, ProfilePlugin>>(() => {
		const allPlugins: ProfilePlugin[] = [
			...knownProfiles,
			...(profiles ?? EMPTY_ARRAY),
		]
		const result = new Map<string, ProfilePlugin>()
		for (const p of allPlugins) {
			p.initialize?.(api, dp)
			result.set(p.profile, p)
			// add data-handlers to the workflow package
			if (p.dataHandler) {
				dp.addResourceHandler(p.dataHandler)
			} else if (p.dataHandler !== null) {
				// TODO: re-handle custom JSON
				// We use null to signal that not handler should be auto-defined
				// dp.addResourceHandler(new JsonDataHandler(p.profile, p.createResource))
			}
		}
		return result
	}, [dp, api, profiles, knownProfiles])
}

export function useFlattened(routes: ResourceRouteGroup[]): ResourceRoute[] {
	return useMemo<ResourceRoute[]>(() => {
		const result: ResourceRoute[] = []
		for (const group of routes) {
			for (const r of group.resources) {
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
	const [acceptRename, setAcceptRename] = useState<{
		handle: (value: string | undefined) => void
	}>({ handle: () => null })
	const [dismissRename, setDismissRename] = useState<{ handle: () => void }>({
		handle: () => null,
	})

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
					setAcceptRename({
						handle: (name: string | undefined) => {
							if (name != null) {
								resource.name = name
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
		}
	}, [showRename, setRenameResource, hideRename])

	return useMemo(
		() => ({
			api,
			rename: {
				resource: renameResource,
				isOpen: isRenameOpen,
				onDismiss: dismissRename.handle,
				onAccept: acceptRename.handle,
			},
		}),
		[
			api,
			renameResource,
			dismissRename.handle,
			acceptRename.handle,
			isRenameOpen,
		],
	)
}
