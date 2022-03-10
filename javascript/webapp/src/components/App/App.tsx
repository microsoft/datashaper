/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import styled from 'styled-components'

import { Footer } from '~components/Footer'

import { ErrorBoundary } from './ErrorBoundary'
import { Header } from './Header'
import { Layout } from './Layout'
import { RouteOptions } from './RouteOptions'
import { StyleContext } from './StyleContext'

export const App: React.FC = memo(function App() {
	return (
		<ErrorBoundary>
			<RecoilRoot>
				<Router>
					<Suspense fallback={<Spinner />}>
						<StyleContext>
							<Container>
								<Header />
								<Layout>
									<RouteOptions />
								</Layout>
								<Footer />
							</Container>
						</StyleContext>
					</Suspense>
				</Router>
			</RecoilRoot>
		</ErrorBoundary>
	)
})

const Container = styled.div``
