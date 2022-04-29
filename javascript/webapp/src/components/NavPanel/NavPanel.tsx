/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Guidance } from '@data-wrangling-components/react'
import { Panel, Toggle } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { useSettings } from '~states/settings'

import { useGuidanceIndex } from '../../hooks/index.js'
import { setDarkMode } from '../../localStorageHandler/localStorageHandler.js'

export interface NavPanelProps {
	isOpen: boolean
	onDismiss: () => void
}

export const NavPanel: React.FC<NavPanelProps> = memo(function NavPanel({
	isOpen,
	onDismiss,
}: NavPanelProps) {
	const [settings, setSettings] = useSettings()
	const index = useGuidanceIndex()
	const location = useLocation()

	const setDarkModeStatus = useCallback(
		async (ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
			const checkedValue = checked ? true : false
			setSettings({ ...settings, isDarkMode: checkedValue })
			await setDarkMode(checkedValue)
		},
		[settings, setSettings],
	)

	const name = useMemo((): string => {
		switch (location.pathname) {
			case '/debug':
				return 'debugPage'
			case '/performance':
				return 'perfPage'
			case '/prepare':
			default:
				return 'prepareDataPage'
		}
	}, [location])

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
					onChange={setDarkModeStatus}
					checked={settings.isDarkMode}
				/>
			</SettingsSection>

			<HelpSection>
				<H3>Help</H3>
				<Guidance name={name} index={index} />
			</HelpSection>

			<LinkSection>
				<H3>Links</H3>
				<ListItem to={'/'}>Prepare Data Page</ListItem>
				<ListItem to={'/debug'}>Debug Page</ListItem>
				<ListItem to={'/performance'}>Performance Test Page</ListItem>
			</LinkSection>
		</Panel>
	)
})

const SettingsSection = styled.div`
	margin-left: 10px;
`

const H3 = styled.h3`
	margin-bottom: 10px;
`

const HelpSection = styled.div`
	margin-left: 10px;
	margin-top: 20px;
`

const LinkSection = styled.div`
	margin-left: 10px;
	margin-top: 20px;
`

const ListItem = styled(Link)`
	display: block;
`
