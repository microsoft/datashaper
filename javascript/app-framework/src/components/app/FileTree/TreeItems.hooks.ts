/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isTableBundle } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { map } from 'rxjs'

import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type { DataShaperAppPlugin } from '../../../types.js'
import type { ResourceTreeData } from './FileTree.types.js'
import { groupTables } from './groupTables.js'

export function useTreeItems(plugins: Map<string, DataShaperAppPlugin>): [
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
					const tables = resources.filter(isTableBundle)
					const other = resources.filter(r => r.profile !== 'databundle')

					const tableTreeItems = groupTables(tables)
					const appTreeItems = other
						.map(r => {
							return {
								href: `/app/${r.profile}/${r.name}`,
								title: r.name,
								icon: plugins.get(r.profile)?.fileTreeIconName ?? '',
							}
						})
						.filter(t => t != null) as ResourceTreeData[]

					return [tableTreeItems, appTreeItems] as [
						ResourceTreeData[],
						ResourceTreeData[],
					]
				}),
			),
		[pkg, plugins],
	)
	return useObservableState(observable, () => [[], []])
}
