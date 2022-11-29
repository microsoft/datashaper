/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import {
	type TableBundle,
	Codebook,
	DataTable,
	Workflow,
} from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'

import type { ProfilePlugin } from '../../../types.js'
import { ResourceGroup } from '../../../types.js'
import {
	BundleEditor,
	CodebookEditor,
	DataSourceEditor,
	RawTableViewer,
	WorkflowEditor,
} from '../../editors/index.js'

export const KNOWN_PROFILE_PLUGINS: ProfilePlugin[] = [
	{
		profile: KnownProfile.TableBundle,
		title: 'Table',
		renderer: BundleEditor,
		iconName: 'ViewAll',
		group: ResourceGroup.Data,
		onGetMenuItems: (resource: TableBundle) => {
			const result: IContextualMenuItem[] = [
				{
					key: 'delete',
					text: 'Delete',
					onClick: () => resource.dispose(),
				},
			]
			if (resource.input == null) {
				result.push({
					key: 'add-datatable',
					text: 'Add Datatable',
					onClick: () => {
						resource.input = new DataTable()
					},
				})
			}
			if (resource.workflow == null) {
				result.push({
					key: 'add-workflow',
					text: 'Add Workflow',
					onClick: () => {
						resource.workflow = new Workflow()
					},
				})
			}
			if (resource.codebook == null) {
				result.push({
					key: 'add-codebook',
					text: 'Add Codebook',
					onClick: () => {
						resource.codebook = new Codebook()
					},
				})
			}
			return result
		},
	},
	{
		profile: KnownProfile.DataTable,
		title: 'Datatable',
		renderer: DataSourceEditor,
		iconName: 'PageData',
		group: ResourceGroup.Data,
		onGetMenuItems: (resource: TableBundle) => {
			return [
				{
					key: 'delete',
					text: 'Delete',
					onClick: () => resource.dispose(),
				},
			]
		},
		onGetRoutes(resource: DataTable, pathContext) {
			const dataPath = Array.isArray(resource.path)
				? resource.path[0]
				: resource.path
			if (dataPath != null) {
				const pathItems = dataPath.split('/') ?? []
				const lastPathItem = pathItems[pathItems.length - 1]
				if (lastPathItem != null) {
					return {
						preItemSiblings: [
							{
								title: lastPathItem,
								href: `${pathContext}/${lastPathItem}`,
								icon: 'Database',
								renderer: RawTableViewer,
								props: { dataTable: resource },
							},
						],
					}
				}
			}
		},
	},
	{
		profile: KnownProfile.Codebook,
		title: 'Codebook',
		renderer: CodebookEditor,
		iconName: 'FormLibraryMirrored',
		group: ResourceGroup.Data,
		onGetMenuItems: (resource: Codebook) => {
			return [
				{
					key: 'delete',
					text: 'Delete',
					onClick: () => resource.dispose(),
				},
			]
		},
	},
	{
		profile: KnownProfile.Workflow,
		title: 'Workflow',
		renderer: WorkflowEditor,
		iconName: 'SetAction',
		group: ResourceGroup.Data,
		onGetMenuItems: (resource: Workflow) => {
			return [
				{
					key: 'delete',
					text: 'Delete',
					onClick: () => resource.dispose(),
				},
			]
		},
	},
]
