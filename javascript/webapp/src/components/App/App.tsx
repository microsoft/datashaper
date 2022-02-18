/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled from 'styled-components'
import { Header } from './Header'
import { Layout } from './Layout'
import { RouteOptions } from './RouteOptions'
import { StyleContext } from './StyleContext'

export const App: React.FC = memo(function App() {
	return (
		<Router>
			<StyleContext>
				<Container>
					<Header />
					<PageContainer>
						<Layout>
							<RouteOptions />
						</Layout>
					</PageContainer>
				</Container>
			</StyleContext>
		</Router>
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
