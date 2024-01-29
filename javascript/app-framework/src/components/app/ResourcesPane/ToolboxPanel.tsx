/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, IconButton, Modal } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import type { Resource } from '@datashaper/workflow'
import { Container, Content, Header, ToolboxList, ToolboxListItem } from './ToolboxPanel.styles.js'
import type { ToolboxPanelProps } from './ToolboxPanel.types.js'
import { icons } from './ResourcesPane.styles.js'
import { AppProfile, ResourceRouteGroup, ToolboxItem } from '../../../types.js'
import { useBoolean } from '@fluentui/react-hooks'
import { ModalHost } from '../../modals/ModalHost.js'

export const ToolboxPanel: React.FC<ToolboxPanelProps> = memo(function ToolboxPanel({
	onToggleExpanded,
	resources,
	profiles,
	selectedKey
}) {
	const profile = useProfileFromHref(selectedKey, resources, profiles)
	const items = profile?.getToolboxItems?.() || []
	const [isOpen, { toggle: onToggleModal, setFalse: onDismiss }] = useBoolean(false)
	const [currentTool, setCurrentTool] = useState<ToolboxItem | undefined>(undefined)
	const handleToolClick = useCallback((tool: ToolboxItem) => {
		setCurrentTool(tool)
		onToggleModal()
	}, [onToggleModal, setCurrentTool])
	const res = useResources(resources)
	return (
		<Container>
			<Header>
				<IconButton iconProps={icons.toolbox} onClick={onToggleExpanded} />
				Toolbox
			</Header>
			<Content>
				<Toolbox items={items} onClick={handleToolClick}/>
			</Content>
			{currentTool ? 
			<ModalHost
				title={currentTool?.title}
				isOpen={isOpen}
				onDismiss={onDismiss}
			><currentTool.renderer resources={res} /></ModalHost>
			: null }
		</Container>
	)
})

const Toolbox: React.FC<{ items: ToolboxItem[], onClick: (tool: ToolboxItem) => void }> = memo(function ToolboxPanel({
	items,
	onClick
}) {
	return (
		<ToolboxList>
			{items.map((item: ToolboxItem) => <ToolboxListItem key={item.key}><ActionButton onClick={() => onClick(item)} iconProps={icons.tool}>{item.title}</ActionButton></ToolboxListItem>)}
		</ToolboxList>
	)
})


/**
 * When a given resource is selected in the tree, we want to look up its profile instance
 * @param href 
 * @param resources 
 * @param profiles 
 */
function useProfileFromHref(href: string | undefined, resources: ResourceRouteGroup[], profiles: Map<string, AppProfile>) {
	return useMemo(
		() => {
			const res = 
				resources
				.flatMap((r) => r.resources)
				.filter((r) => r.href === href)[0] // we should always only have exactly one
				// and it definitely should have an entry in the profiles map
			return profiles.get(res?.props.resource.profile)
		},	
		[resources],
	)
}

// map back from routes to underlying resources
function useResources(resources: ResourceRouteGroup[]): Resource[] {
	return useMemo(() => resources.flatMap((r) => r.resources).map((r) => r.props.resource as Resource), [resources])
}