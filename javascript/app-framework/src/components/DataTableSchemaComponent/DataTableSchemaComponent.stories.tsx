/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema } from '@datashaper/schema'
import { DataFormat, DataOrientation } from '@datashaper/schema'
import type { ComponentStory } from '@storybook/react'
import { useState } from 'react'

import { DataTableSchemaComponent } from './DataTableSchemaComponent.js'

const storyMetadata = {
	title: 'App:Components/DataTableSchemaComponent',
	component: DataTableSchemaComponent,
	argTypes: {},
}
export default storyMetadata

const Template: ComponentStory<typeof DataTableSchemaComponent> = ({
	...args
}): JSX.Element => {
	const { schema } = args

	const [internal, setInternal] = useState<Partial<DataTableSchema>>(schema)

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
			<DataTableSchemaComponent
				{...args}
				schema={internal}
				onChange={setInternal}
			/>
		</div>
	)
}

export const CsvSchemaStory = Template.bind({})
CsvSchemaStory.storyName = 'CSV'
CsvSchemaStory.args = {
	schema: {
		format: DataFormat.CSV,
		parser: {
			delimiter: ',',
			quoteChar: '"',
		},
	},
}

export const JsonSchemaStory = Template.bind({})
JsonSchemaStory.storyName = 'JSON'
JsonSchemaStory.args = {
	schema: {
		format: DataFormat.JSON,
		shape: {
			orientation: DataOrientation.Records,
		},
	},
}
