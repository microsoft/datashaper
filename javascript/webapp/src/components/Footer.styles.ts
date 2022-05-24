/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

export const FooterEl = styled.footer`
	width: 100%;
`

export const Container = styled.div`
	width: 500px;
	height: 20px;
	font-size: 12px;
	display: flex;
	flex-direction: row;
	align-items: center;
	align-content: center;
	justify-content: space-between;
	margin: auto;
`

export const constants = {
	privacyUrl: 'https://go.microsoft.com/fwlink/?LinkId=521839',
	termsOfUseUrl: 'https://go.microsoft.com/fwlink/?LinkID=206977',
	trademarksUrl: 'https://www.microsoft.com/trademarks',
	microsoft: 'https://www.microsoft.com',
	copyright: `©️ ${new Date().getFullYear()} Microsoft`,
}

export const LinkDiv = styled.div`
	cursor: pointer;
`
export const LinkA = styled.a`
	cursor: pointer;
	text-decoration: none !important;
`
