/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '@datashaper/workflow'
import { memo, useCallback, useEffect } from 'react'
import { type MutableSnapshot, RecoilRoot, useRecoilSnapshot } from 'recoil'

import type { RecoilBasedProfileHostProps } from './RecoilBasedProfileHost.types.js'

export const RecoilBasedProfileHost: React.FC<
	RecoilBasedProfileHostProps<any>
> = memo(function RecoilProfileHost({
	resource,
	children,
	loadState,
	saveState,
}) {
	const initializeState = useCallback(
		(snap: MutableSnapshot) => {
			loadState(resource, snap)
		},
		[loadState, resource],
	)
	return (
		<RecoilRoot key={resource.id} initializeState={initializeState} override>
			<HostInner resource={resource} saveState={saveState}>
				{children}
			</HostInner>
		</RecoilRoot>
	)
})

const HostInner: React.FC<{
	children: React.ReactNode
	resource: Resource
	saveState: RecoilBasedProfileHostProps<any>['saveState']
}> = memo(function HostInner({ resource, children, saveState }) {
	const snap = useRecoilSnapshot()

	useEffect(() => {
		// on unmount/snapshot change, flush the state
		saveState(resource, snap)
	}, [resource, saveState, snap])
	return <>{children}</>
})
