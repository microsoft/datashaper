/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MarkdownBrowser } from '@essex/components'
import { Panel, Toggle } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { useGuidanceContent } from '../hooks/index.js'
import { useSettings } from '../states/settings.js'
import { useSetDarkMode } from './SettingsPanel.hooks.js'
import { H3, HelpSection, SettingsSection } from './SettingsPanel.styles.js'
import type { SettingsPanelProps } from './SettingsPanel.types.js'

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(
	function SettingsPanel({ isOpen, onDismiss }: SettingsPanelProps) {
		const content = useGuidanceContent()
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
					<MarkdownBrowser home={'prepareDataPage'} content={content} />
				</HelpSection>
			</Panel>
		)
	},
)
