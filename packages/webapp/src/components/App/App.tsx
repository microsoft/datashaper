/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import { StyleContext } from './StyleContext'
import { MainPage, PerfPage, TransformPage, PrepareDataPage } from '~pages'
export const App: React.FC = memo(function App() {
	const search = window.location.search
	return (
		<StyleContext>
			<Container>
				<Header />
				<PageContainer>
					{/* this is just a hacky router to load the perf testing page if needed */}
					{search === '?perf' ? (
						<PerfPage />
					) : search === '?transform' ? (
						<TransformPage />
					) : search === '?prepare' ? (
						<PrepareDataPage />
					) : (
						<MainPage />
					)}
				</PageContainer>
			</Container>
		</StyleContext>
	)
})

const Container = styled.div`
	margin: 0px;
	height: 100vh;
	display: flex;
	flex-flow: column;
`

const PageContainer = styled.div`
	padding: 20px 20px 0px 20px;
	height: 90%;
`
