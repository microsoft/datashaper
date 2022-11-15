/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'allotment/dist/style.css'

import { type ResourceTreeData, DataShaperApp } from '@datashaper/app-framework'
import { Spinner } from '@fluentui/react'
import { memo, Suspense, useCallback, useState } from 'react'
import { RecoilRoot } from 'recoil'

import { Layout } from '../components/Layout.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { StyleContext } from './StyleContext.js'

export const App: React.FC = memo(function App() {
	const [selectedKey, setSelectedKey] = useState<string | undefined>()
	const onSelect = useCallback(
		(v: ResourceTreeData) => setSelectedKey(v.key),
		[setSelectedKey],
	)
	return (
		<ErrorBoundary>
			<RecoilRoot>
				<Suspense fallback={<Spinner />}>
					<StyleContext>
						<Layout>
							<DataShaperApp
								examples={examples}
								selectedKey={selectedKey}
								onSelect={onSelect}
							>
								<div></div>
							</DataShaperApp>
						</Layout>
					</StyleContext>
				</Suspense>
			</RecoilRoot>
		</ErrorBoundary>
	)
})

const examples = [
	{ name: 'Smoking', url: 'examples/smoking.json' },
	{ name: 'Companies', url: 'examples/companies.json' },
]
