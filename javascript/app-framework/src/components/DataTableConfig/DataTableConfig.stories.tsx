/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataFormat } from '@datashaper/schema'
import { DataTable } from '@datashaper/workflow'
import type { StoryFn } from '@storybook/react'
import { useEffect, useMemo } from 'react'

import { DataTableConfig } from './DataTableConfig.js'

const storyMetadata = {
	title: 'App:Components/DataTableConfig',
	component: DataTableConfig,
	argTypes: {},
}
export default storyMetadata

export const DataTableConfigStory = {
	render: ({ ...args }): JSX.Element => {
		const resource = useMemo(
			() =>
				new DataTable({
					format: DataFormat.CSV,
				}),
			[],
		)
		useEffect(
			() => resource.onChange(() => console.log('resource changed', resource)),
			[resource],
		)
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
				<DataTableConfig {...args} resource={resource} />
			</div>
		)
	},

	name: 'DataTableConfig',
}
