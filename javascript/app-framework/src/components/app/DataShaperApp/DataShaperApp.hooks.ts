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
import {
	PANE_BREAK_WIDTH,
	PANE_COLLAPSED_SIZE,
} from './DataShaperApp.styles.js'

function useKnownProfilePlugins(): ProfilePlugin[] {
	return useConst(() => {
		const datatablePlugin = new DataTableProfile()
		const codebookPlugin = new CodebookProfile()
		const workflowPlugin = new WorkflowProfile()
		const tableBundlePlugin = new TableBundleProfile(
			datatablePlugin,
			codebookPlugin,
			workflowPlugin,
		)

		return [
			datatablePlugin,
			codebookPlugin,
			tableBundlePlugin,
			workflowPlugin,
		] as ProfilePlugin<any, any>[]
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
			p.initialize?.({ api, dataPackage: dp })
			result.set(p.profile, p)
			dp.addResourceHandler(p as ProfileHandler<Resource>)
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
	help: {
		currentHelp: string | undefined
		onInitializeHelp: any
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

	const [helpKey, onRequestHelp] = useState<string | undefined>(undefined)
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
				currentHelp: helpKey ? helpIndex[helpKey] : undefined,
				onInitializeHelp,
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

export function useRegisterPluginHelp(
	plugins: Map<string, ProfilePlugin>,
	onInitializeHelp: any,
) {
	useEffect(() => {
		let help: Record<string, string> = {}
		for (const plugin of plugins.values()) {
			const pluginHelp = plugin?.getHelp?.()
			if (pluginHelp != null) {
				// note that this will quietly overwrite any duplicate keys
				help = { ...help, ...pluginHelp }
			}
		}
		onInitializeHelp(help)
	}, [plugins, onInitializeHelp])
}
