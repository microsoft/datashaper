/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { container } from '@datashaper/tables'
import { Workflow } from '@datashaper/workflow'
import type { ComponentStory } from '@storybook/react'
import { useMemo } from 'react'

import { useWorkflow } from '../hooks/common.js'
import { StepHistoryList } from '../index.js'
import schema from '../verbs/__tests__/specs/aggregated-lookup.json'
import type { StepHistoryListProps } from './StepHistoryList.types.js'

const storyMetadata = {
	title: 'Components/StepHistoryList',
	component: StepHistoryList,
}
export default storyMetadata

const Template: ComponentStory<typeof StepHistoryList> = (
	args: StepHistoryListProps,
	{ loaded: { companies, products } }: any,
): JSX.Element => {
	const workflow = useMemo(() => new Workflow(schema), [schema])
	const wf = useWorkflow(workflow, [
		container('companies', companies),
		container('products', products),
	])

	return (
		<div
			style={{
				width: 300,
				height: 600,
				overflowY: 'auto',
				border: '1px solid orange',
			}}
		>
			<StepHistoryList {...args} workflow={wf} />
		</div>
	)
}

export const Primary = Template.bind({})
