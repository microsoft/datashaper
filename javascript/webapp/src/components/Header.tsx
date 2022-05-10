/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { Container, Subtitle,Title } from './Header.styles.js'
import { NavBar } from './NavBar'

export const Header = memo(function Header() {
	return (
		<Container>
			<Title>Data Wrangling Components</Title>
			<Subtitle>pipeline builder</Subtitle>
			<NavBar />
		</Container>
	)
})
