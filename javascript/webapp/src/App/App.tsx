/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import 'allotment/dist/style.css'

import { type AppProfile, DataShaperApp } from '@datashaper/app-framework'
import { Spinner } from '@fluentui/react'
import { useConst } from '@fluentui/react-hooks'
import { Suspense, memo } from 'react'
import { HashRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { Layout } from '../components/Layout.js'
import { TestAppProfile } from '../profiles/index.js'
import type { AppContext, AppSettings } from '../types.js'
import { About } from './About.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { StyleContext } from './StyleContext.js'

const examples = [
	{ name: 'Smoking', url: 'examples/smoking.json' },
	{ name: 'Companies', url: 'examples/companies.json' },
]

const defaultSettings: AppSettings = {
	darkMode: true,
}

const context: AppContext = {
	initialSettings: {
		name: 'Tester',
	},
}

export const App: React.FC = memo(function App() {
	const customProfiles = useConst<AppProfile[]>(
		() => [new TestAppProfile()] as AppProfile<any, any>[],
	)
	return (
		<ErrorBoundary>
			<RecoilRoot>
				<HashRouter>
					<Suspense fallback={<Spinner />}>
						<StyleContext>
							<Layout>
								<DataShaperApp
									examples={examples}
									profiles={customProfiles}
									defaultSettings={defaultSettings}
									appContext={context}
								>
									<About />
								</DataShaperApp>
							</Layout>
						</StyleContext>
					</Suspense>
				</HashRouter>
			</RecoilRoot>
		</ErrorBoundary>
	)
})
