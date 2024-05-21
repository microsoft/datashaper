/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'

import type { GenerativeMigrationProps } from './GenerativeMigration.js'
import { GenerativeMigration } from './GenerativeMigration.js'

export const GenerativeMigrationStory: ComponentStory<
	typeof GenerativeMigration
> = (
	args: GenerativeMigrationProps,
	{ loaded: { companies, companies2, products, stocks } }: any,
): JSX.Element => (
	<GenerativeMigration
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
