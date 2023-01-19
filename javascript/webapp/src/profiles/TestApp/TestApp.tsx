/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RecoilBasedProfileHost } from '@datashaper/app-framework'
import { DefaultButton } from '@fluentui/react'
import { memo, useCallback } from 'react'
import type { MutableSnapshot, Snapshot } from 'recoil'
import { atom, useRecoilState } from 'recoil'

import type { TestAppResource } from './TestAppResource.js'

export const TestApp: React.FC<{ resource: TestAppResource }> = memo(
	function TestApp({ resource }) {
		return (
			<RecoilBasedProfileHost
				resource={resource}
				loadState={loadState}
				saveState={saveState}
			>
				<TestAppInner />
			</RecoilBasedProfileHost>
		)
	},
)

const countState = atom<number>({ key: 'count', default: 0 })

function loadState(resource: TestAppResource, snapshot: MutableSnapshot): void {
	snapshot.set(countState, resource.count)
}
function saveState(resource: TestAppResource, snapshot: Snapshot): void {
	const count = snapshot.getLoadable(countState).getValue()
	resource.count = count
}

const TestAppInner: React.FC = memo(function TestAppInner() {
	const [count, setCount] = useRecoilState(countState)
	const increment = useCallback(() => setCount((c) => c + 1), [setCount])
	const decrement = useCallback(() => setCount((c) => c - 1), [setCount])

	return (
		<div style={{ margin: 20 }}>
			<h1>Test App</h1>
			<p>Value: {count}</p>
			<DefaultButton text="Increment" onClick={increment} />
			<DefaultButton text="Decrement" onClick={decrement} />
		</div>
	)
})
