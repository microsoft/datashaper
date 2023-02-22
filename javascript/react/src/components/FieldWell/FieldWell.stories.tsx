/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FieldWell } from './FieldWell.js'
import type { FieldWellProps } from './FieldWell.types.js'

const storyMetadata = {
	title: 'Components/FieldWell',
	component: FieldWell,
}
export default storyMetadata

const PrimaryComponent: React.FC<FieldWellProps> = (args) => {
	console.log(args)
	return (
		<div
			style={{
				width: 200,
				height: 80,
				border: '1px solid orange',
			}}
		>
			<FieldWell {...args} />
		</div>
	)
}

export const Primary = {
	render: PrimaryComponent,
	args: {
		field: {
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
		},
	},
}
