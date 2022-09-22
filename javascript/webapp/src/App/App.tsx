/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, Suspense } from 'react'
import { RecoilRoot } from 'recoil'

import { Layout } from '../components/Layout.js'
import { PrepareDataPage } from '../pages/PrepareDataPage/PrepareDataPage.base.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { StyleContext } from './StyleContext.js'

export const App: React.FC = memo(function App() {
	return (
		<ErrorBoundary>
			<RecoilRoot>
				<Suspense fallback={<Spinner />}>
					<StyleContext>
						<Layout>
							<PrepareDataPage />
						</Layout>
					</StyleContext>
				</Suspense>
			</RecoilRoot>
		</ErrorBoundary>
	)
})
