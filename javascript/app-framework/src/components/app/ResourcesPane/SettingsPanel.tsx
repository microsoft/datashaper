/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import React, { memo, useCallback, useMemo } from 'react'
import { Container, Content, Header, Inner } from './SettingsPanel.styles.js'
import type { SettingsPanelProps } from './SettingsPanel.types.js'
import { icons } from './ResourcesPane.styles.js'
import type { Resource, Configurable } from '@datashaper/workflow'
import { CollapsiblePanel, Settings } from '@essex/components'
import type { ResourceRouteGroup } from '../../../types.js'
import { useApplicationSettings } from '../../../settings/application.js'

export const SettingsPanel: React.FC<SettingsPanelProps> = memo(
	function SettingsPanel({ onToggleExpanded, resources }) {
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
const ResourceBlock: React.FC<{ resource: ConfigurableResource }> = ({
	resource,
}) => {
	const { config } = resource
	const setter = useCallback(
		(callback: (previous: unknown) => unknown) =>
			(resource.config = callback(config)),
		[resource, config],
	)
	return (
		<SettingsBlock title={resource.name} settings={config} setter={setter} />
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

/**
 * Resource routes are grouped, and then have the actual resource nested as props.
 * This flat maps and unpacks all of thate to return a single list of resources containing config blocks.
 */
function useUnpackedResources(resources: ResourceRouteGroup[]) {
	return useMemo(() => {
		return resources
			.flatMap((r) => r.resources)
			.map((r) => r.props.resource)
			.filter((res) => res.config !== undefined)
	}, [resources])
}
