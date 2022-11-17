/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import type { ComponentStory } from '@storybook/react'
import { useEffect, useState } from 'react'

import { CodebookFieldEditor } from './CodebookFieldEditor.js'

const codebookResult = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	id: 'http://json-schema.org/draft-07/schema#',
	name: 'Generator',
	fields: [
		{
			name: 'index',
			type: 'number',
			nature: 'nominal',
			metadata: {
				maximum: 15,
				minimum: 0,
			},
		},
		{
			name: 'int',
			type: 'number',
			nature: 'nominal',
		},
		{
			name: 'float',
			type: 'number',
			nature: 'nominal',
		},
		{
			name: 'boolean',
			type: 'boolean',
			nature: 'nominal',
		},
		{
			name: 'string',
			type: 'string',
			nature: 'nominal',
			metadata: {
				count: 15,
			},
		},
		{
			name: 'date',
			type: 'string',
			nature: 'nominal',
		},
		{
			name: 'array',
			type: 'array',
			nature: 'nominal',
		},
		{
			name: 'obj',
			type: 'object',
			nature: 'nominal',
		},
	] as Field[],
}

export const Single: ComponentStory<
	typeof CodebookFieldEditor
> = (): JSX.Element => {
	const [field, setField] = useState(codebookResult.fields[0] as Field)

	useEffect(() => {
		console.log({ field })
	}, [field])
	return <CodebookFieldEditor field={field} onChange={setField} />
}

const storyMetadata = {
	title: 'Components/CodebookFieldEditor',
	component: CodebookFieldEditor,
}

export default storyMetadata
