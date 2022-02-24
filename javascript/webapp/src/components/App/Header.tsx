/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ThemeVariant } from '@thematic/core'
import { memo } from 'react'
import styled from 'styled-components'
import { NavBar } from '~components/NavBar'

export const Header = memo(function Header() {
	return (
		<Container>
			<Title>Data Wrangling Components</Title>
			<Subtitle>pipeline builder</Subtitle>
			<NavBar />
		</Container>
	)
})

// always ensure the header is dark, regardless of mode
const Container = styled.div`
	padding: 4px 16px 4px 16px;
	background: ${({ theme }) =>
		theme.variant === ThemeVariant.Light
			? theme.application().highContrast()
			: theme.application().lowContrast()};
	border-bottom: 1px solid
		${({ theme }) =>
			theme.variant === ThemeVariant.Light
				? theme.application().midHighContrast()
				: theme.application().lowMidContrast()};
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const Title = styled.h1`
	text-transform: uppercase;
	font-size: 28px;
	margin: 0;
	color: ${({ theme }) =>
		theme.variant === ThemeVariant.Light
			? theme.application().lowContrast()
			: theme.application().midHighContrast()};
	width: 70%;
`

const Subtitle = styled.h2`
	margin: 0;
	font-weight: normal;
	color: ${({ theme }) =>
		theme.variant === ThemeVariant.Light
			? theme.application().lowMidContrast()
			: theme.application().midHighContrast()};
	width: 20%;
	text-align: right;
`
