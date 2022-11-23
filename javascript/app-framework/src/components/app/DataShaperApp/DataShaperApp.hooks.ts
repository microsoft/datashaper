/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	type DataPackage,
	type Resource,
	isDataTable,
} from '@datashaper/workflow'
import { useDebounceFn } from 'ahooks'
import type { AllotmentHandle } from 'allotment'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type { DataShaperAppPlugin } from '../../../types.js'
import {
	BundleEditor,
	CodebookEditor,
	DataSourceEditor,
	RawTableViewer,
	WorkflowEditor,
} from '../../editors/index.js'

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

export interface GeneratedRoute {
	path: string
	renderer: React.ComponentType
	props: any
}

export function useDataPackageResourceRoutes(
	plugins: Map<string, DataShaperAppPlugin>,
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
	plugins: Map<string, DataShaperAppPlugin>,
): GeneratedRoute[] {
	const result: GeneratedRoute[] = []
	addSources(result, dp.resources, plugins)
	return result
}

function addSources(
	result: GeneratedRoute[],
	resources: Resource[],
	plugins: Map<string, DataShaperAppPlugin>,
	root = '/resource',
) {
	for (const resource of resources) {
		// TODO: check plugins
		const renderer =
			DEFAULT_HANDLERS[resource.profile] ||
			plugins.get(resource.profile)?.renderer

		// Special case for raw resources embedded in datatable under `path` property
		// and or datatable.json
		if (isDataTable(resource)) {
			if (resource.path != null && typeof resource.path === 'string') {
				const pathItems = resource.path.split('/') ?? []
				const lastPathItem = pathItems[pathItems.length - 1]
				result.push({
					path: `${root}/${lastPathItem}`,
					renderer: RawTableViewer as any,
					props: { dataTable: resource },
				})
				result.push({
					path: `${root}/datatable.json`,
					renderer: DataSourceEditor as any,
					props: { dataTable: resource },
				})
			}
		} else if (renderer != null) {
			result.push({
				path: `${root}/${resource.name}`,
				renderer: renderer as any,
				props: { resource },
			})
		}

		/** Descend into child resources */
		const children = (resource as any).sources
		if (children?.length > 0) {
			addSources(result, children, plugins, `${root}/${resource.name}`)
		}
	}
}

const DEFAULT_HANDLERS: Record<string, React.ComponentType<any>> = {
	tablebundle: BundleEditor,
	codebook: CodebookEditor,
	source: DataSourceEditor,
	datatable: BundleEditor,
	workflow: WorkflowEditor,
	datasource: RawTableViewer,
}
