/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

declare const WcpConsent: any

export interface ConsentOptions {
	/**
	 * Default: 'dark'
	 */
	theme?: string
	/**
	 * default: 'cookie-consent'
	 */
	elementId?: string
	onConsent?: (consent: Consent) => void
}

export interface Consent {
	Required: boolean
	Advertising: boolean
	Analytics: boolean
	SocialMedia: boolean
}

let currentConsent: Consent = {
	Required: true,
	Advertising: false,
	Analytics: false,
	SocialMedia: false,
}
let consentUtil: any
const NOOP = () => {
	/*nothing*/
}

export function showCookieConsent({
	theme = 'dark',
	elementId = 'cookie-banner',
	onConsent = NOOP,
}: ConsentOptions = {}): void {
	const element = document.getElementById(elementId)
	if (!element) {
		throw new Error(`Could not find element with id ${elementId}`)
	}
	WcpConsent.init(
		navigator.language,
		element,
		function init(err: any, consent: Consent) {
			if (err) {
				console.error('error initalizing WcpConsent', err)
			} else {
				consentUtil = consent
				onConsent(consent)
			}
		},
		function onChange(consent: Consent) {
			currentConsent = consent
			onConsent(consent)
		},
		theme,
	)
}

export function getConsent(): Consent {
	return currentConsent
}

export function manageConsent(): void {
	consentUtil.manageConsent()
}

// show consent banner immediately
showCookieConsent({
	onConsent: c => {
		console.log('consent changed', c)
	},
})
