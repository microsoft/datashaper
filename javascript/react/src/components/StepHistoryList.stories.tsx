/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Workflow } from '@datashaper/workflow'
import type { ComponentStory } from '@storybook/react'
import { useCallback, useState } from 'react'

import { DisplayOrder } from '../enums.js'
import { useWorkflow } from '../hooks/common.js'
import schema from '../verbs/__tests__/specs/every-operation.json'
import { StepHistoryList } from './StepHistoryList.js'
import type { StepHistoryListProps } from './StepHistoryList.types.js'

const storyMetadata = {
	title: 'Components/StepHistoryList',
	component: StepHistoryList,
}
export default storyMetadata

const workflow = new Workflow(schema)

const Template: ComponentStory<typeof StepHistoryList> = (
	args: StepHistoryListProps,
	{ loaded: { companies, companies2, products, stocks } }: any,
): JSX.Element => {
	const wf = useWorkflow(workflow, [
		{ id: 'companies', table: companies },
		{ id: 'companies2', table: companies2 },
		{ id: 'products', table: products },
		{ id: 'stocks', table: stocks },
	])
	const [selected, setSelected] = useState<string | undefined>()
	const handleSelect = useCallback(
		(id: string) => setSelected(prev => (prev === id ? undefined : id)),
		[setSelected],
	)
	return (
		<div
			style={{
				width: 300,
				height: 600,
				overflowY: 'auto',
				border: '1px solid orange',
			}}
		>
			<StepHistoryList
				{...args}
				workflow={wf}
				selectedKey={selected}
				onSelect={handleSelect}
			/>
		</div>
	)
}

export const Primary = Template.bind({})

export const SaveDelete = Template.bind({})
SaveDelete.storyName = 'Save & delete buttons'
SaveDelete.args = {
	onSave: s => console.log('save', s),
	onDelete: s => console.log('delete', s),
}

export const Customized = Template.bind({})
Customized.args = {
	order: DisplayOrder.FirstOnTop,
	styles: {
		buttonContainer: {
			background: 'azure',
			borderBottom: '2px solid teal',
		},
		stepHeaders: {
			name: {
				color: 'orange',
			},
			selected: {
				color: 'crimson',
			},
			details: {
				color: 'teal',
			},
		},
	},
}
