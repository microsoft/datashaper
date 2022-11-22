/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataBundle } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useContext, useMemo } from 'react'
import { map } from 'rxjs'

import { DataPackageContext } from '../context/index.js'

export function useDataBundles(): DataBundle[] {
	const dp = useContext(DataPackageContext)
	const observable = useMemo(
		() =>
			dp.resources$.pipe(
				map(resources => {
					return resources.filter(
						r => r.profile === 'databundle',
					) as DataBundle[]
				}),
			),
		[dp],
	)
	return useObservableState(observable, () => [])
}
