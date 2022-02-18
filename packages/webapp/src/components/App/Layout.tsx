/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import React, { memo, Suspense } from 'react'
import styled from 'styled-components'

export const Layout: React.FC = memo(function Layout({ children }) {
	return (
		<Container>
			<Suspense fallback={<StyledSpinner />}>
				<Content>{children}</Content>
			</Suspense>
		</Container>
	)
})

const StyledSpinner = styled(Spinner)`
	margin-top: 20px;
`
const Container = styled.div`
	margin: 0;
	height: 100vh;
	display: flex;
	flex-flow: column;
`

const Content = styled.div`
	margin: 0;
	height: 100%;
	flex: 1;
	display: flex;
	flex-flow: column;
`
