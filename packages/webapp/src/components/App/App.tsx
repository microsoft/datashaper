/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import { StyleContext } from './StyleContext'
import { MainPage, PerfPage } from '~pages'
export const App: React.FC = memo(function App() {
	return (
		<StyleContext>
			<Header />
			<PageContainer>
				{/* this is just a hacky router to load the perf testing page if needed */}
				{window.location.search === '?perf' ? <PerfPage /> : <MainPage />}
			</PageContainer>
		</StyleContext>
	)
})

const PageContainer = styled.div`
	padding: 20px;
`
