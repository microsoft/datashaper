/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useObservableState } from 'observable-hooks'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { map } from 'rxjs'

import { useDataPackage } from '../../../hooks/useDataPackage.js'
import type { ResourceTreeData } from './FileTree.types.js'
import { groupTables } from './groupTables.js'

export function useTreeItems(): ResourceTreeData[] {
	const pkg = useDataPackage()
	const observable = useMemo(
		() => pkg.tableStore.tables$.pipe(map(tables => groupTables(tables))),
		[pkg],
	)
	return useObservableState(observable, () => [])
}

export function useCurrentPath(): string {
	const location = useLocation()
	return useMemo(() => `${location.pathname}${location.search}`, [location])
}

export function useOnSelectItem(): ({ route }: ResourceTreeData) => void {
	const navigate = useNavigate()
	return useCallback(
		({ route }: ResourceTreeData) => navigate(`${route}`),
		[navigate],
	)
}
