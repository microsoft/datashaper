/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Panel, Toggle } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { useSettings } from '~states/settings'

export interface NavPanelProps {
	isOpen: boolean
	onDismiss: () => void
}

export const NavPanel: React.FC<NavPanelProps> = memo(function NavPanel({
	isOpen,
	onDismiss,
}: NavPanelProps) {
	const [settings, setSettings] = useSettings()

	const setDarkModeStatus = useCallback(
		(ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
			setSettings({ ...settings, isDarkMode: checked ? true : false })
		},
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
			<h3>Settings</h3>
			<Toggle
				label="Dark Mode"
				defaultChecked
				onText="On"
				offText="Off"
				onChange={setDarkModeStatus}
				checked={settings.isDarkMode}
			/>

			<h3>Help</h3>
		</Panel>
	)
})
