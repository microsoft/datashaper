/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, Suspense } from 'react'

import { useFlyoutPanelState } from '../hooks/useFlyoutPanelState.js'
import { useNonPropagatingClickHandler } from '../hooks/useNonPropagatingClickHandler.js'
import { Footer } from './Footer.js'
import { Header } from './Header.js'
import {
	Container,
	Content,
	SlidingContainer,
	StyledSpinner,
} from './Layout.styles.js'
import { SettingsPanel } from './SettingsPanel.js'

export const Layout: React.FC<
	React.PropsWithChildren<{
		/*nothing*/
	}>
> = memo(function Layout({ children }) {
	const [isSettingsOpen, openSettings, dismissSettings] = useFlyoutPanelState()
	return (
		<>
			<Container>
				<Header onSettingsClick={openSettings} />
				<Suspense fallback={<StyledSpinner />}>
					<Content className={'layout-content-container'}>{children}</Content>
				</Suspense>
				<Footer />
			</Container>
			{/* Flyout Panels */}
			<SettingsPanel isOpen={isSettingsOpen} onDismiss={dismissSettings} />
		</>
	)
})
