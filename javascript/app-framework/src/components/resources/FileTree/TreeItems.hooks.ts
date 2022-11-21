/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import type { SchemaResource } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { map } from 'rxjs'

import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type { ResourceTreeData } from './FileTree.types.js'
import { groupTables } from './groupTables.js'

export function useTreeItems(
	plugins: Map<string, (r: SchemaResource) => ResourceTreeData>,
): [
	// Data Items
	ResourceTreeData[],
	// App Items
	ResourceTreeData[],
] {
	const pkg = useDataPackage()
	const observable = useMemo(
		() =>
			pkg.resources$.pipe(
				map(resources => {
					const tables = resources.filter(
						r => r.profile === 'datatable',
					) as DataTable[]
					const other = resources.filter(r => r.profile !== 'datatable')

					const tableTreeItems = groupTables(tables)
					const appTreeItems = other
						.map(r => plugins.get(r.profile)?.(r))
						.filter(t => t != null) as ResourceTreeData[]

					return [tableTreeItems, appTreeItems] as [
						ResourceTreeData[],
						ResourceTreeData[],
					]
				}),
			),
		[pkg],
	)
	return useObservableState(observable, () => [[], []])
}
