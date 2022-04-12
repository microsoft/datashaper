/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMicrosoftConsentBanner } from '@essex/hooks'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { useTheme } from '../../states/settings.js'

export const Footer: FC = memo(function Footer() {
	const theme = useTheme()
	const CONSENT_CONF = {
		theme: theme.variant,
		elementId: 'cookie-banner',
		onChange: (c: any) => console.log('consent changed', c),
	}
	const [, manageConsent] = useMicrosoftConsentBanner(CONSENT_CONF)

	return (
		<FooterEl>
			<Container>
				<Link href={constants.privacyUrl}>Privacy</Link>
				{' | '}
				<Link
					id={'managecookies'}
					onClick={manageConsent}
					style={{ color: '#3f75bf' }}
				>
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
