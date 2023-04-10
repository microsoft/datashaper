/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import { Container, Content, Header, Inner } from './SettingsPanel.styles.js'
import type { SettingsPanelProps } from './SettingsPanel.types.js'
import { icons } from './ResourcesPane.styles.js'
import { CollapsiblePanel, Settings } from '@essex/components'
import type { AppProfile, ProfileSettings } from '../../../types.js'
import {
	useApplicationSettings,
	useProfileSettings,
} from '../../../settings/index.js'

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(
	function SettingsPanel({ onToggleExpanded, profiles }) {
		const blocks = useUnwrapProfiles(profiles)
		return (
			<Container>
				<Header>
					<IconButton iconProps={icons.settings} onClick={onToggleExpanded} />
					Settings
				</Header>
				<Content>
					<ApplicationBlock />
					{blocks.map((block) => (
						<ProfileBlock
							key={`settings-block-${block.profile}`}
							profile={block}
						/>
					))}
				</Content>
			</Container>
		)
	},
)

const ApplicationBlock: React.FC = () => {
	const [settings, setter] = useApplicationSettings()
	return (
		<SettingsBlock title={'Application'} settings={settings} setter={setter} />
	)
}

const ProfileBlock: React.FC<{ profile: AppProfile }> = ({ profile }) => {
	const [settings, setter] = useProfileSettings(profile.profile)

	return (
		<SettingsBlock title={profile.title} settings={settings} setter={setter} />
	)
}

const SettingsBlock: React.FC<{
	title: string
	settings: ProfileSettings
	setter: any
}> = ({ title, settings, setter }) => {
	const handleChange = useCallback(
		(key: string, value: any) =>
			setter((prev: any) => ({ ...prev, [key]: value })),
		[setter],
	)
	return (
		<CollapsiblePanel title={title}>
			<Inner>
				<Settings settings={settings} onChange={handleChange} />
			</Inner>
		</CollapsiblePanel>
	)
}

function useUnwrapProfiles(profiles: Map<string, AppProfile>) {
	return useMemo(() => {
		const blocks: AppProfile[] = []
		profiles.forEach((profile) => {
			if (profile.getSettings) {
				blocks.push(profile)
			}
		})
		return blocks.sort((a, b) => a.title.localeCompare(b.title))
	}, [profiles])
}
