/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState } from 'react'
import { FieldWell } from './FieldWell.js'
import type { FieldWellProps } from './FieldWell.types.js'

const storyMetadata = {
	title: 'Components/FieldWell',
	component: FieldWell,
}
export default storyMetadata

const Component: React.FC<FieldWellProps> = (args) => {
	const [selectedKey, setSelectedKey] = useState<string | undefined>()
	return (
		<div
			style={{
				width: 200,
				border: '1px solid orange',
				padding: 8,
			}}
		>
			<FieldWell
				{...args}
				selectedKey={selectedKey}
				onChange={setSelectedKey}
				onReset={() => setSelectedKey(undefined)}
			/>
		</div>
	)
}

const well = {
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
}

export const Primary = {
	render: Component,
	args: {
		...well,
	},
}

export const Customized = {
	render: Component,
	args: {
		...well,
		required: true,
		styles: {
			root: {
				border: '1px dotted dodgerblue',
				padding: 8,
			},
			title: {
				fontWeight: 'bold',
			},
			required: {
				color: 'orange',
			},
			well: {
				border: '1px solid dodgerblue',
				borderRadius: 8,
			},
			icon: {
				root: {
					color: 'orange',
				},
			},
		},
	},
}
