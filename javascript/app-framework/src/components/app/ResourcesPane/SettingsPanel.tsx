/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SettingsConfig } from '@essex/components'
import { IconButton } from '@fluentui/react'
import React, { memo, useCallback, useMemo } from 'react'
import { Container, Content, Header, Inner } from './SettingsPanel.styles.js'
import type { SettingsPanelProps } from './SettingsPanel.types.js'
import { icons } from './ResourcesPane.styles.js'
import type { Resource, Configurable } from '@datashaper/workflow'
import { CollapsiblePanel, Settings } from '@essex/components'
import type { AppProfile, ResourceRouteGroup } from '../../../types.js'
import { useApplicationSettings } from '../../../settings/application.js'
import { useObservableState } from 'observable-hooks'

/**
 * Manages the display of settings for any resources in the application that declared a settings configuration.
 * The `settings` object is a raw object of settings values, while `config` is a configuration object that
 * defines the relevant attributes of the settings such as optional labels, list options, etc.
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = memo(
	function SettingsPanel({ onToggleExpanded, resources, profiles }) {
		const blocks = useUnpackedResources(resources)
		return (
			<Container>
				<Header>
					<IconButton iconProps={icons.settings} onClick={onToggleExpanded} />
					Settings
				</Header>
				<Content>
					<ApplicationBlock />
					{blocks.map((block) => (
						<ResourceBlock
							key={`settings-block-${block.name}`}
							resource={block}
							profile={profiles.get(block.profile)!}
						/>
					))}
				</Content>
			</Container>
		)
	},
)

/**
 * Special settings block for global application.
 */
const ApplicationBlock: React.FC = () => {
	const [settings, setSettings] = useApplicationSettings()
	const setter = useCallback(
		(callback: (previous: unknown) => unknown) =>
			setSettings(callback(settings)),
		[settings, setSettings],
	)
	return (
		<SettingsBlock title={'Application'} settings={settings} setter={setter} />
	)
}

interface ConfigurableResource extends Resource, Configurable {}

/**
 * Settings block for a resource instance.
 */
const ResourceBlock: React.FC<{
	resource: ConfigurableResource
	profile: AppProfile
}> = ({ resource, profile }) => {
	const settings = useObservableState(resource.config$, resource.config)
	const config = profile.getSettingsConfig?.()
	const setter = useCallback(
		(callback: (previous: unknown) => unknown) =>
			(resource.config = callback(settings)),
		[resource, settings],
	)
	return (
		<SettingsBlock
			title={resource.name}
			settings={settings}
			settingsConfig={config}
			setter={setter}
		/>
	)
}

/**
 * Generic settings block for any type.
 * Uses underlying essex auto-settings component.
 * Note the mapping of essex onChange to an object updater pattern.
 */
const SettingsBlock: React.FC<{
	title: string
	settings: unknown
	setter: (callback: (previous: unknown) => unknown) => void
	settingsConfig?: SettingsConfig
}> = ({ title, settings, setter, settingsConfig }) => {
	const handleChange = useCallback(
		(key: string, value: any) =>
			setter((prev: any) => ({ ...prev, [key]: value })),
		[setter],
	)
	return (
		<CollapsiblePanel title={title}>
			<Inner>
				<Settings
					settings={settings}
					config={settingsConfig}
					onChange={handleChange}
				/>
			</Inner>
		</CollapsiblePanel>
	)
}

/**
 * Resource routes are grouped, and then have the actual resource nested as props.
 * This flat maps and unpacks all of that to return a single list of resources containing config blocks.
 */
function useUnpackedResources(resources: ResourceRouteGroup[]) {
	return useMemo(
		() =>
			resources
				.flatMap((r) => r.resources)
				.map((r) => r.props.resource)
				.filter((res) => res.config !== undefined),
		[resources],
	)
}
