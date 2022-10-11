/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { useFlyoutPanelState } from '../hooks/useFlyoutPanelState.js'
import { Footer } from './Footer.js'
import { Header } from './Header.js'
import { Content } from './Layout.styles.js'
import { SettingsPanel } from './SettingsPanel.js'

export const Layout: React.FC<
	React.PropsWithChildren<{
		/*nothing*/
	}>
> = memo(function Layout({ children }) {
	const [isSettingsOpen, openSettings, dismissSettings] = useFlyoutPanelState()
	return (
		<>
			<Header onSettingsClick={openSettings} />
			<Content className={'layout-content-container'}>{children}</Content>
			<Footer />
			<SettingsPanel isOpen={isSettingsOpen} onDismiss={dismissSettings} />
		</>
	)
})
