/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import type { DataTable } from '@datashaper/workflow'

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
	},
	{
		profile: KnownProfile.DataTable,
		title: 'Datatable',
		renderer: DataSourceEditor,
		iconName: 'PageData',
		group: ResourceGroup.Data,
		onGenerateRoutes(resource: DataTable, pathContext) {
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
	},
	{
		profile: KnownProfile.Workflow,
		title: 'Workflow',
		renderer: WorkflowEditor,
		iconName: 'SetAction',
		group: ResourceGroup.Data,
	},
]
