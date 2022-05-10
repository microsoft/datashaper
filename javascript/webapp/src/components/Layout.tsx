/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, Suspense, useCallback } from 'react'

import { useFlyoutPanelState } from '../hooks/useFlyoutPanelState.js'
import { useNonPropagatingClickHandler } from '../hooks/useNonPropagatingClickHandler.js'
import { Footer } from './Footer.js'
import { Header } from './Header.js'
import {
	Container,
	Content,
	FixedContainer,
	SlidingContainer,
	StyledSpinner,
} from './Layout.styles.js'
import { NavPanel } from './NavPanel.js'
import { SettingsPanel } from './SettingsPanel.js'

export const Layout: React.FC<
	React.PropsWithChildren<{
		/*nothing*/
	}>
> = memo(function Layout({ children }) {
	const [isMenuOpen, , dismissMenu, toggleMenu] = useFlyoutPanelState()
	const [isSettingsOpen, openSettings, dismissSettings] = useFlyoutPanelState()
	const handleMenuClick = useNonPropagatingClickHandler(toggleMenu)

	return (
		<>
			<Container onClick={dismissMenu}>
				<SlidingContainer className={'layout-container'} isOffset={isMenuOpen}>
					<Header
						onMenuClick={handleMenuClick}
						onSettingsClick={openSettings}
					/>
					<Suspense fallback={<StyledSpinner />}>
						<Content className={'layout-content-container'}>{children}</Content>
					</Suspense>
				</SlidingContainer>
				<Footer />
			</Container>
			<FixedContainer isOpen={isMenuOpen} onClick={dismissMenu}>
				<NavPanel onDismiss={dismissMenu} />
			</FixedContainer>

			{/* Flyout Panels */}
			<SettingsPanel isOpen={isSettingsOpen} onDismiss={dismissSettings} />
		</>
	)
})
