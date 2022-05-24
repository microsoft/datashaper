/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, Suspense } from 'react'
import { HashRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { Layout } from '../components/Layout.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { RouteOptions } from './RouteOptions.js'
import { StyleContext } from './StyleContext.js'

export const App: React.FC = memo(function App() {
	return (
		<ErrorBoundary>
			<RecoilRoot>
				<HashRouter>
					<Suspense fallback={<Spinner />}>
						<StyleContext>
							<Layout>
								<RouteOptions />
							</Layout>
						</StyleContext>
					</Suspense>
				</HashRouter>
			</RecoilRoot>
		</ErrorBoundary>
	)
})
