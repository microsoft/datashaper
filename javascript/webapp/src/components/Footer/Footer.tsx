/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { manageConsent } from '../../consent'
import { FC, memo } from 'react'
import styled from 'styled-components'

export const Footer: FC = memo(function Footer() {
	return (
		<FooterEl>
			<Container>
				<Link href={constants.privacyUrl}>Privacy</Link>
				{' | '}
				<Link id={'managecookies'} onClick={manageConsent}>
					Cookies
				</Link>
				{' | '}
				<Link href={constants.termsOfUseUrl}>Terms of Use</Link>
				{' | '}
				<Link href={constants.trademarksUrl}>Trademarks</Link>
				{' | '}
				<Link href={constants.microsoft}>{constants.copyright}</Link>
			</Container>
		</FooterEl>
	)
})

const Link: FC<{
	href?: string
	id?: string
	className?: string
	style?: React.CSSProperties
	onClick?: () => void
}> = memo(function Link({ id, className, children, href, style, onClick }) {
	return href == null ? (
		<LinkDiv style={style} className={className} id={id} onClick={onClick}>
			{children}
		</LinkDiv>
	) : (
		<LinkA
			target="_blank"
			rel="noreferrer"
			href={href}
			style={style}
			className={className}
			id={id}
		>
			{children}
		</LinkA>
	)
})

const FooterEl = styled.footer`
	width: 100%;
`

const Container = styled.div`
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

const constants = {
	privacyUrl: 'https://go.microsoft.com/fwlink/?LinkId=521839',
	termsOfUseUrl: 'https://go.microsoft.com/fwlink/?LinkID=206977',
	trademarksUrl: 'https://www.microsoft.com/trademarks',
	microsoft: 'https://www.microsoft.com',
	copyright: `©️ ${new Date().getFullYear()} Microsoft`,
}

const LinkDiv = styled.div`
	cursor: pointer;
`
const LinkA = styled.a`
	cursor: pointer;
	text-decoration: none !important;
`
