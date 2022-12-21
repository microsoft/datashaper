/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import { DataTable } from '@datashaper/workflow'

import { DataTableEditor, RawTableViewer } from '../components/editors/index.js'
import type { GeneratedExtraRoutes, ProfilePlugin , ResourceRoute } from '../types.js'
import { ResourceGroupType } from '../types.js'

export class DataTableProfile implements ProfilePlugin<DataTable> {
	public readonly profile = KnownProfile.DataTable
	public readonly title = 'Datatable'
	public readonly renderer = DataTableEditor
	public readonly iconName = 'PageData'
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	public createResource(): DataTable {
		return new DataTable()
	}

	public getRoutes(
		resource: DataTable,
		pathContext: string,
	): GeneratedExtraRoutes | undefined {
		const createSibling = (
			dataRef: string,
			defaultTitle: string,
		): ResourceRoute => {
			const pathItems = dataRef.split('/') ?? []
			const lastPathItem = pathItems[pathItems.length - 1]
			return {
				title: lastPathItem ?? defaultTitle,
				href: `${pathContext}/${lastPathItem}`,
				icon: 'Database',
				renderer: RawTableViewer,
				props: { dataTable: resource },
			}
		}
		const dataRef = resource.dataRef
		if (dataRef != null) {
			// If multiple data refs, create a sibling for each
			const preItemSiblings: ResourceRoute[] = Array.isArray(dataRef)
				? dataRef.map((ref, index) => createSibling(ref, `data-${index}}`))
				: [createSibling(dataRef, 'data')]

			if (preItemSiblings.length > 0) {
				console.log('SIBS', preItemSiblings)
				return { preItemSiblings }
			}
		}
	}
}
