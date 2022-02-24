/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'
import styled from 'styled-components'

export const Header = memo(function Header() {
	return (
		<Container>
			<Title>Data Wrangling Components</Title>
			<Subtitle>pipeline builder</Subtitle>
		</Container>
	)
})

const Container = styled.div`
	padding: 4px 16px 4px 16px;
	background: ${({ theme }) => theme.application().highContrast()};
	border-bottom: 1px solid ${({ theme }) => theme.application().lowContrast()};
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const Title = styled.h1`
	text-transform: uppercase;
	font-size: 28px;
	margin: 0;
	color: ${({ theme }) => theme.application().lowContrast().hex()};
`

const Subtitle = styled.h2`
	margin: 0;
	font-weight: normal;
	color: ${({ theme }) => theme.application().lowContrast().hex()};
`
