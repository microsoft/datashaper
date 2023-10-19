/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMicrosoftConsentBanner } from '@essex/hooks'
import { useTheme } from '@fluentui/react'
import type { FC } from 'react'
import { memo, useMemo } from 'react'

import { constants, Container, LinkA, LinkDiv } from './Footer.styles.js'

export const Footer: FC = memo(function Footer() {
	const theme = useTheme()
	const CONSENT_CONF = {
		theme: theme.isInverted ? 'dark' : 'light',
		elementId: 'cookie-banner',
		onChange: (c: any) => console.log('consent changed', c),
	}
	const [, manageConsent] = useMicrosoftConsentBanner(CONSENT_CONF)
	// override link color to provide subtle footer while still meeting contrast requirements
	const style = useMemo(() => ({ color: theme.palette.neutralSecondary }), [theme])
	return (
		<Container>
			<Link href={constants.privacyUrl} style={style}>Privacy</Link>
			{' | '}
			<Link
				id={'managecookies'}
				onClick={manageConsent}
				style={style}
			>
				Cookies
			</Link>
			{' | '}
			<Link href={constants.termsOfUseUrl} style={style}>Terms of Use</Link>
			{' | '}
			<Link href={constants.trademarksUrl} style={style}>Trademarks</Link>
			{' | '}
			<Link href={constants.microsoft} style={style}>{constants.copyright}</Link>
			{' | '}
			<Link href={constants.github} style={style}>GitHub</Link>
		</Container>
	)
})

const Link: FC<
	React.PropsWithChildren<{
		href?: string
		id?: string
		className?: string
		style?: React.CSSProperties
		onClick?: () => void
	}>
> = memo(function Link({ id, className, children, href, style, onClick }) {
	return href == null ? (
		<LinkDiv style={style} className={className} id={id} onClick={onClick}>
			{children}
		</LinkDiv>
	) : (
		<LinkA
			target='_blank'
			rel='noreferrer'
			href={href}
			style={style}
			className={className}
			id={id}
		>
			{children}
		</LinkA>
	)
})
