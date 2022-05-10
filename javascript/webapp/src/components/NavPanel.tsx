/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Guidance } from '@data-wrangling-components/react'
import { Panel, Toggle } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { useGuidanceIndex } from '../hooks/index.js'
import { useSettings } from '../states/settings'
import { useName, useSetDarkMode } from './NavPanel.hooks.js'
import {
	H3,
	HelpSection,
	LinkSection,
	ListItem,
	SettingsSection,
} from './NavPanel.styles.js'
import type { NavPanelProps } from './NavPanel.types.js'

export const NavPanel: React.FC<NavPanelProps> = memo(function NavPanel({
	isOpen,
	onDismiss,
}: NavPanelProps) {
	const name = useName()
	const index = useGuidanceIndex()
	const [settings, setSettings] = useSettings()
	const setDarkMode = useSetDarkMode(settings, setSettings)
	const handleDarkModeChange = useCallback(
		(_ev: unknown, checked?: boolean) => void setDarkMode(checked),
		[setDarkMode],
	)

	return (
		<Panel
			isLightDismiss
			isOpen={isOpen}
			onDismiss={onDismiss}
			closeButtonAriaLabel="Close"
			headerText="Menu"
		>
			<SettingsSection>
				<H3>Settings</H3>
				<Toggle
					label="Dark Mode"
					onText="On"
					offText="Off"
					onChange={handleDarkModeChange}
					checked={settings.isDarkMode}
				/>
			</SettingsSection>

			<HelpSection>
				<H3>Help</H3>
				<Guidance name={name} index={index} />
			</HelpSection>

			<LinkSection>
				<H3>Links</H3>
				<ListItem to={'/'} onClick={onDismiss}>
					Prepare Data Page
				</ListItem>
				<ListItem to={'/debug'} onClick={onDismiss}>
					Debug Page
				</ListItem>
				<ListItem to={'/performance'} onClick={onDismiss}>
					Performance Test Page
				</ListItem>
			</LinkSection>
		</Panel>
	)
})
