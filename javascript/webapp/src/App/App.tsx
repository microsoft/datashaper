/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, Suspense } from 'react'
import { HashRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { ErrorBoundary } from './ErrorBoundary'
import { Layout } from './Layout'
import { RouteOptions } from './RouteOptions'
import { StyleContext } from './StyleContext'

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
