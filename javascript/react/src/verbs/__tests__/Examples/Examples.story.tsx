/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import type { ExamplesProps } from './Examples.js'
import { Examples } from './Examples.js'

export const ExamplesStory: ComponentStory<typeof Examples> = (
	_args: ExamplesProps,
	{ loaded: { companies, companies2, products, stocks } }: any,
): JSX.Element => (
	<Examples
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
ExamplesStory.storyName = 'Example Workflows'
