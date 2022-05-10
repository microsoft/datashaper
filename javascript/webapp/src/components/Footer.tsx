/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMicrosoftConsentBanner } from '@essex/hooks'
import type { FC } from 'react'
import { memo } from 'react'

import { useTheme } from '../states/settings.js'
import {
	constants,
	Container,
	FooterEl,
	LinkA,
	LinkDiv,
} from './Footer.styles.js'

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
