/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	type ProfileComponentProps,
	RecoilBasedProfileHost,
} from '@datashaper/app-framework'
import { DefaultButton } from '@fluentui/react'
import { useObservableState } from 'observable-hooks'
import { memo, useCallback } from 'react'
import type { MutableSnapshot, Snapshot } from 'recoil'
import { atom, useRecoilState } from 'recoil'

import type { TestAppResource } from './TestAppResource.js'

export type TestAppProps = ProfileComponentProps<TestAppResource>

export const TestApp: React.FC<TestAppProps> = memo(function TestApp({
	resource,
}) {
	return (
		<RecoilBasedProfileHost
			resource={resource}
			loadState={loadState}
			saveState={saveState}
		>
			<TestAppInner resource={resource} />
		</RecoilBasedProfileHost>
	)
})

const countState = atom<number>({ key: 'count', default: 0 })

function loadState(resource: TestAppResource, snapshot: MutableSnapshot): void {
	snapshot.set(countState, resource.count)
}
function saveState(resource: TestAppResource, snapshot: Snapshot): void {
	const count = snapshot.getLoadable(countState).getValue()
	resource.count = count
}

const TestAppInner: React.FC<TestAppProps> = memo(function TestAppInner({
	resource,
}) {
	const [count, setCount] = useRecoilState(countState)
	const increment = useCallback(() => setCount((c) => c + 1), [setCount])
	const decrement = useCallback(() => setCount((c) => c - 1), [setCount])
	const config = useObservableState(resource.config$, resource.config)
	return (
		<div style={{ margin: 20 }}>
			<h1>{`Test App: ${config.title} with language: ${config.language}, version ${config.version}`}</h1>
			<p>Value: {count}</p>
			<div
				style={{
					display: 'flex',
					gap: 10,
				}}
			>
				<DefaultButton text="Increment" onClick={increment} />
				<DefaultButton text="Decrement" onClick={decrement} />
			</div>
		</div>
	)
})
