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
import type { AppProfile } from '../../../types.js'
import { useFrameworkSettings } from '../../../settings/index.js'

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
					{blocks.map((block) => (
						<SettingsBlock
							key={`settings-block-${block.key}`}
							profile={block}
						/>
					))}
				</Content>
			</Container>
		)
	},
)

const SettingsBlock: React.FC<{ profile: ProfileMeta }> = ({ profile }) => {
	const [settings, setter] = useFrameworkSettings(profile.key)
	const handleChange = useCallback(
		(key: string, value: any) => setter({ [key]: value }),
		[setter],
	)
	// TODO: this shouldn't be necessary - app services should _only_ provide the profiles with registered settings
	if (!settings) {
		return null
	}
	return (
		<CollapsiblePanel title={profile.title}>
			<Inner>
				<Settings settings={settings} onChange={handleChange} />
			</Inner>
		</CollapsiblePanel>
	)
}

interface ProfileMeta {
	key: string
	title: string
}

// TODO: this should all move into the app services
function useUnwrapProfiles(profiles: Map<string, AppProfile>) {
	return useMemo(() => {
		const blocks: ProfileMeta[] = [
			{
				key: 'application',
				title: 'Application',
			},
		]
		profiles.forEach((value, key) => {
			blocks.push({
				key,
				title: value.title,
			})
		})
		return blocks.sort((a, b) => a.title.localeCompare(b.title))
	}, [profiles])
}
