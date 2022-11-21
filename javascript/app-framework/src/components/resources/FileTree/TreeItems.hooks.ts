/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useMemo } from 'react'
import { map } from 'rxjs'

import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type { ResourceTreeData } from './FileTree.types.js'
import { groupTables } from './groupTables.js'

export function useTreeItems(): [
	// Data Items
	ResourceTreeData[],
	// App Items
	ResourceTreeData[],
] {
	const pkg = useDataPackage()
	const observable = useMemo(
		() =>
			pkg.resources.resources$.pipe(
				map(resources => {
					const tables = resources.filter(
						r => r.profile === 'datatable',
					) as DataTable[]

					const tableTreeItems = groupTables(tables)

					return [tableTreeItems, [] as ResourceTreeData[]] as [
						ResourceTreeData[],
						ResourceTreeData[],
					]
				}),
			),
		[pkg],
	)
	return useObservableState(observable, () => [[], []])
}
