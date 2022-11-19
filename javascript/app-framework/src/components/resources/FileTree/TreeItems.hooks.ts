/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
		() => pkg.tableStore.tables$.pipe(map(tables => groupTables(tables))),
		[pkg],
	)
	const dataItems = useObservableState(observable, () => [])
	return [dataItems, []]
}
