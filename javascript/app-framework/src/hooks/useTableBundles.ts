/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableBundle } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useContext, useMemo } from 'react'
import { map } from 'rxjs'

import { DataPackageContext } from '../context/index.js'

export function useTableBundles(): TableBundle[] {
	const dp = useContext(DataPackageContext)
	const observable = useMemo(
		() =>
			dp.resources$.pipe(
				map(resources => {
					return resources.filter(
						r => r.profile === 'tablebundle',
					) as TableBundle[]
				}),
			),
		[dp],
	)
	return useObservableState(observable, () => [])
}
