/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import styled from 'styled-components'
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
					<StyleContext>
						<Suspense fallback={<Spinner />}>
							<Container>
								<Header />
								<PageContainer>
									<Layout>
										<RouteOptions />
									</Layout>
								</PageContainer>
							</Container>
						</Suspense>
					</StyleContext>
				</Router>
			</RecoilRoot>
		</ErrorBoundary>
	)
})

const Container = styled.div`
	margin: 0px;
	height: 100vh;
	display: flex;
	flex-flow: column;
`

const PageContainer = styled.div`
	padding-top: 20px;
	height: 90%;
`
