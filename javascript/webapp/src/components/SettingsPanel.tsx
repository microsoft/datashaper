/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useFrameworkSettings } from '@datashaper/app-framework'
import { Settings } from '@essex/components'
import { Panel } from '@fluentui/react'
import { memo, useCallback } from 'react'

import { H3, SettingsSection } from './SettingsPanel.styles.js'
import type { SettingsPanelProps } from './SettingsPanel.types.js'

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(
	function SettingsPanel({ isOpen, onDismiss }: SettingsPanelProps) {
		const [settings, setSettings] = useFrameworkSettings()
		const handleSettingsChange = useCallback(
			(key: string, value: any) => setSettings(value, key),
			[setSettings],
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
					<Settings settings={settings} onChange={handleSettingsChange} />
				</SettingsSection>
			</Panel>
		)
	},
)
