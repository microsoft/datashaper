/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import type { DataTable } from '@datashaper/workflow'

import type { ProfileHandlerPlugin } from '../../../types.js'
import {
	BundleEditor,
	CodebookEditor,
	DataSourceEditor,
	RawTableViewer,
	WorkflowEditor,
} from '../../editors/index.js'

export const KNOWN_PROFILE_PLUGINS: ProfileHandlerPlugin[] = [
	{
		profile: KnownProfile.TableBundle,
		renderer: BundleEditor,
		iconName: 'ViewAll',
	},
	{
		profile: KnownProfile.DataTable,
		renderer: DataSourceEditor,
		iconName: 'PageData',
		onGenerateRoutes(resource: DataTable, pathContext) {
			const dataPath = Array.isArray(resource.path)
				? resource.path[0]
				: resource.path
			if (dataPath != null) {
				const pathItems = dataPath.split('/') ?? []
				const lastPathItem = pathItems[pathItems.length - 1]
				return [
					{
						path: `${pathContext}/${lastPathItem}`,
						renderer: RawTableViewer,
						props: { dataTable: resource },
					},
				]
			}
		},
	},
	{
		profile: KnownProfile.Codebook,
		renderer: CodebookEditor,
		iconName: 'FormLibraryMirrored',
	},
	{
		profile: KnownProfile.Workflow,
		renderer: WorkflowEditor,
		iconName: 'SetAction',
	},
]
