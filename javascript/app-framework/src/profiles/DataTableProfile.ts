/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { DataTable } from '@datashaper/workflow'
import { DataTableProfile as DataTableProfileBase } from '@datashaper/workflow'

import { DataTableEditor } from '../components/editors/index.js'
import type { GeneratedExtraRoutes, ProfilePlugin } from '../types.js'
import { ResourceGroupType } from '../types.js'
import { DataTableRenderer } from './renderers/DataTableRenderer.js'

export class DataTableProfile
	extends DataTableProfileBase
	implements ProfilePlugin<DataTable>
{
	public readonly title = 'Datatable'
	public readonly renderer = DataTableRenderer
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
							renderer: DataTableEditor,
							props: { resource },
						},
					],
				}
			}
		}
	}

	public getHelp(): Record<string, string> {
		return content
	}
}
