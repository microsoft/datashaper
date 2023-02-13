/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
				icon: 'Table',
				children: [
					{
						title: 'Metadata',
						icon: 'Database',
					},
				],
				slots: [
					{
						placeholder: 'Select node list',
						icon: 'CircleRing',
						profile: 'nodes',
						required: true,
					},
					{
						placeholder: 'Select edge list',
						icon: 'Line',
						profile: 'edges',
					},
				],
			},
		],
	},
]
const ResourceTreeComponent: React.FC = (args) => {
	return (
		<div
			style={{
				width: 240,
				height: 400,
				padding: 10,
				overflowY: 'auto',
				border: '1px solid orange',
			}}
		>
			<ResourceTree
				expanded
				{...args}
				resources={resources}
				onSelect={(res) => console.log('selected', res)}
			/>
		</div>
	)
}

export const ResourceTreeStory = {
	render: ResourceTreeComponent,
	name: 'ResourceTree',
}
