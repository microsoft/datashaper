/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StoryFn, StoryObj } from '@storybook/react'

import type { InputTablesProps } from './InputTables.js'
import { InputTables } from './InputTables.js'

const storyMetadata = {
	title: 'Workflows',
}
export default storyMetadata

export const InputTablesStory: StoryObj<typeof InputTables> = {
	render: (
		_args: InputTablesProps,
		{ loaded: { companies, companies2, products, stocks } }: any,
	): JSX.Element => (
		<InputTables
			tables={[
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
	),

	name: 'Input Tables',
}
