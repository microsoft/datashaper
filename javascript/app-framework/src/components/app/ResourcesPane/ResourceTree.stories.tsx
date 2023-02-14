/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useState } from 'react'
import type { ResourceRouteGroup, ResourceSlot } from '../../../types.js'
import { ResourceGroupType } from '../../../types.js'
import { ResourceTree } from './ResourceTree.js'

const storyMetadata = {
	title: 'App:Components/ResourceTree',
	component: ResourceTree,
	argTypes: {},
}
export default storyMetadata

const resources: ResourceRouteGroup[] = [
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
							predicate: () => false,
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
							predicate: () => false,
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
					{
						slot: {
							key: 'metadata',
							title: 'Metadata table',
							placeholder: 'Select metadata table',
							icon: 'Table',
							predicate: () => false,
						},
					},
				],
			},
		],
	},
]
const ResourceTreeComponent: React.FC = (args) => {
	const [selectedRoute, setSelectedRoute] = useState<string | undefined>()
	const [res, setRes] = useState<ResourceRouteGroup[]>(resources)
	const handleBindingChange = useCallback(
		(slot: ResourceSlot, key?: string) => {
			console.log('binding change', slot, key)
			setRes((prev) =>
				prev.map((rg) => ({
					...rg,
					resources: rg.resources.map((r) => ({
						...r,
						fieldWells: r.fieldWells?.map((fw) => ({
							...fw,
							selectedKey: fw.slot.key === slot.key ? key : fw.selectedKey,
						})),
					})),
				})),
			)
		},
		[],
	)
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
				resources={res}
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
