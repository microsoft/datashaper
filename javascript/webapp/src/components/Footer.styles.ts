/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const Container = styled.footer`
	width: 100%;
	height: 32px;
	font-size: 12px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 18px;
	align-items: center;
	color: ${({ theme }) => theme.palette.neutralTertiary};
	background: ${({ theme }) => theme.palette.neutralLight};
	border-top: 1px solid ${({ theme }) => theme.palette.neutralTertiaryAlt};
`

export const constants = {
	privacyUrl: 'https://go.microsoft.com/fwlink/?LinkId=521839',
	termsOfUseUrl: 'https://go.microsoft.com/fwlink/?LinkID=206977',
	trademarksUrl: 'https://www.microsoft.com/trademarks',
	microsoft: 'https://www.microsoft.com',
	copyright: `©️ ${new Date().getFullYear()} Microsoft`,
	github: 'https://github.com/microsoft/datashaper',
}

export const LinkDiv = styled.div`
	cursor: pointer;
`
export const LinkA = styled.a`
	cursor: pointer;
	text-decoration: none !important;
`
