/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import type { WorkflowExampleProps } from './WorkflowExample.js'
import { WorkflowExample } from './WorkflowExample.js'

export const WorkflowExampleStory: ComponentStory<typeof WorkflowExample> = (
	args: WorkflowExampleProps,
	{ loaded: { companies, companies2, products, stocks } }: any,
): JSX.Element => (
	<WorkflowExample
		{...args}
		inputs={[
			{
				id: 'companies',
				table: companies,
			},
			{
				id: 'companies2',
				table: companies2,
			},
			{
				id: 'products',
				table: products,
			},
			{
				id: 'stocks',
				table: stocks,
			},
		]}
	/>
)
