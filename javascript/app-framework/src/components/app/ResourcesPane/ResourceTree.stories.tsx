/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useState } from 'react'
import type { ResourceRouteGroup } from '../../../types.js'
import { ResourceGroupType } from '../../../types.js'
import { ResourceTree } from './ResourceTree.js'

const storyMetadata = {
	title: 'App:Components/ResourceTree',
	component: ResourceTree,
	argTypes: {},
}
export default storyMetadata

const ResourceTreeComponent: React.FC = (args) => {
	const [selectedRoute, setSelectedRoute] = useState<string | undefined>()
	const [resources, setResources] = useState<ResourceRouteGroup[]>([])
	useEffect(() => {
		const res: ResourceRouteGroup[] = [
			{
				type: ResourceGroupType.Data,
				resources: [
					{
						key: 'graph',
						title: 'Graph',
						icon: 'Flow',
						children: [
							{
								key: 'nodes',
								title: 'Nodes',
								icon: 'Table',
								href: '/resources/data/graph/nodes',
							},
							{
								key: 'edges',
								title: 'Edges',
								icon: 'Table',
								href: '/resources/data/graph/edges',
							},
						],
						fieldWells: [
							{
								key: 'nodes',
								title: 'Node bindings',
								placeholder: 'Select node list',
								icon: 'CircleRing',
								options: [
									{
										key: 'nodes',
										text: 'Nodes',
									},
									{
										key: 'edges',
										text: 'Edges',
									},
								],
								onChange: mapper('nodes', setResources),
							},
							{
								key: 'edges',
								title: 'Edge bindings',
								placeholder: 'Select edge list',
								icon: 'Line',
								required: true,
								options: [
									{
										key: 'nodes',
										text: 'Nodes',
									},
									{
										key: 'edges',
										text: 'Edges',
									},
								],
								selectedKey: 'edges',
								onChange: mapper('edges', setResources),
							},
							{
								key: 'metadata',
								title: 'Metadata table',
								placeholder: 'Select metadata table',
								icon: 'Table',
								onChange: mapper('metadata', setResources),
							},
						],
					},
				],
			},
		]
		setResources(res)
	}, [])

	return (
		<div
			style={{
				width: 240,
				height: 400,
				overflowY: 'auto',
				border: '1px solid orange',
			}}
		>
			<ResourceTree
				{...args}
				resources={resources || []}
				selectedRoute={selectedRoute}
				onSelect={(res) => setSelectedRoute(res?.href)}
			/>
		</div>
	)
}

const mapper = (wellKey: string, setter: any) => {
	return (key: string) => {
		setter((prev: ResourceRouteGroup[]) => {
			return prev.map((group) => {
				return {
					...group,
					resources: group.resources.map((r) => {
						return {
							...r,
							fieldWells: r.fieldWells?.map((f) => {
								return {
									...f,
									selectedKey: f.key === wellKey ? key : f.selectedKey,
								}
							}),
						}
					}),
				}
			})
		})
	}
}

export const ResourceTreeStory = {
	render: ResourceTreeComponent,
	name: 'ResourceTree',
}
