/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'
import { ResourceGroupType } from '../../../types.js'
import { ResourceTree } from './ResourceTree.js'

const storyMetadata = {
	title: 'App:Components/ResourceTree',
	component: ResourceTree,
	argTypes: {},
}
export default storyMetadata

const resources = [
	{
		type: ResourceGroupType.Data,
		resources: [
			{
				title: 'Graph',
				icon: 'Flow',
				children: [
					{
						title: 'Nodes',
						icon: 'Link',
						href: '/resources/data/graph/nodes',
					},
					{
						title: 'Edges',
						icon: 'Link',
						href: '/resources/data/graph/edges',
					},
				],
				fieldWells: [
					{
						slot: {
							key: 'nodes',
							title: 'Node bindings',
							placeholder: 'Select node list',
							icon: 'CircleRing',
							profile: 'nodes',
						},
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
					},
					{
						slot: {
							key: 'edges',
							title: 'Edge bindings',
							placeholder: 'Select edge list',
							icon: 'Line',
							profile: 'edges',
						},
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
					},
				],
			},
		],
	},
]
const ResourceTreeComponent: React.FC = (args) => {
	const [selectedRoute, setSelectedRoute] = useState<string | undefined>()
	const handleBindingChange = useCallback((slot, key) => {
		console.log('binding change', slot, key)
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
				expanded
				{...args}
				resources={resources}
				selectedRoute={selectedRoute}
				onSelect={(res) => setSelectedRoute(res?.href)}
				onBindingChange={handleBindingChange}
			/>
		</div>
	)
}

export const ResourceTreeStory = {
	render: ResourceTreeComponent,
	name: 'ResourceTree',
}
