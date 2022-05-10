/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Spinner } from '@fluentui/react'
import { memo, Suspense } from 'react'
import styled from 'styled-components'

import { Footer } from '../components/Footer.js'
import { Header } from '../components/Header.js'

export const Layout: React.FC<
	React.PropsWithChildren<{
		/*nothing*/
	}>
> = memo(function Layout({ children }) {
	return (
		<Container>
			<Header />
			<Container className={'layout-container'}>
				<Suspense fallback={<StyledSpinner />}>
					<Content className={'layout-content-container'}>{children}</Content>
				</Suspense>
			</Container>
			<Footer />
		</Container>
	)
})

const StyledSpinner = styled(Spinner)`
	margin-top: 20px;
`
const Container = styled.div``

const Content = styled.div``
