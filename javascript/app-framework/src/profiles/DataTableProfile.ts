/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import { DataTableProfile as DataTableProfileBase } from '@datashaper/workflow'

import { DataTableEditor, RawTableViewer } from '../components/editors/index.js'
import { guidance } from '../guidance.js'
import type { GeneratedExtraRoutes, ProfilePlugin } from '../types.js'
import { ResourceGroupType } from '../types.js'

export class DataTableProfile
	extends DataTableProfileBase
	implements ProfilePlugin<DataTable>
{
	public readonly title = 'Datatable'
	public readonly renderer = DataTableEditor
	public readonly iconName = 'PageData'
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	public getRoutes(
		resource: DataTable,
		routes: Map<string, string>,
	): GeneratedExtraRoutes | undefined {
		const pathContext = routes.get(resource.name)
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
							props: { resource },
						},
					],
				}
			}
		}
	}

	public getHelp(): Record<string, string> {
		return guidance()
	}
}
