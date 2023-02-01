/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Field } from '@datashaper/schema'
import type { TableMetadata } from '@datashaper/tables'
import { useState } from 'react'

import { CodebookFieldEditor } from './CodebookFieldEditor.js'

const storyMetadata = {
	title: 'Components/Codebook',
	component: CodebookFieldEditor,
	argTypes: {},
}
export default storyMetadata

const codebookResult = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	id: 'http://json-schema.org/draft-07/schema#',
	name: 'Generator',
	profile: 'codebook',
	fields: [
		{
			name: 'ID',
			title: 'Identity',
			description: 'Identifier for the record',
			type: 'number',
			nature: 'ordinal',
			example: 5,
		},
		{
			name: 'diagnosis',
			type: 'number',
			nature: 'discrete',
		},
		{
			name: 'test',
			type: 'number',
			nature: 'discrete',
		},
		{
			name: ' letter',
			type: 'string',
			nature: 'nominal',
		},
		{
			name: ' letter2',
			type: 'string',
			nature: 'nominal',
		},
		{
			name: ' letter3',
			type: 'string',
			nature: 'nominal',
		},
	],
} as CodebookSchema

const metadata: TableMetadata = {
	rows: 1000,
	cols: 6,
	columns: {
		ID: {
			bins: [
				{
					min: 5.87,
					count: 759,
				},
				{
					min: 358.428,
					count: 0,
				},
				{
					min: 710.986,
					count: 1,
				},
				{
					min: 1063.5439999999999,
					count: 74,
				},
				{
					min: 1416.1019999999999,
					count: 164,
				},
				{
					min: 1768.6599999999999,
					count: 75,
				},
				{
					min: 2121.218,
					count: 43,
				},
				{
					min: 2473.776,
					count: 21,
				},
				{
					min: 2826.334,
					count: 72,
				},
				{
					min: 3178.892,
					count: 56,
				},
			],
			count: 1265,
			distinct: 1182,
			maximum: 3531.45,
			mean: 891.7830434782592,
			median: 201.91,
			minimum: 5.87,
			mode: 9.15,
			stdev: 1075.6086847575084,
		},
	},
}

const CodebookFieldEditorStoryComponent: React.FC = (args: any) => {
	const [field, setField] = useState(codebookResult.fields[0] as Field)

	return (
		<CodebookFieldEditor
			field={field}
			metadata={metadata}
			onChangeField={setField}
			{...args}
		/>
	)
}

export const CodebookFieldEditorStory = {
	render: CodebookFieldEditorStoryComponent,
	name: 'Codebook Field Editor',
	args: {},
}
