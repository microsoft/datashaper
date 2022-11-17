/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Field } from '@datashaper/schema'
import { generateCodebook } from '@datashaper/tables'
import type { ComponentStory } from '@storybook/react'
import { fromCSV } from 'arquero'
import { useState } from 'react'

import { CodebookFieldEditor } from './CodebookFieldEditor.js'
import {
	CodebookFields,
	DEFAULT_CODEBOOK_FIELDS,
} from './CodebookFieldEditor.types.js'
import { CodebookTableEditor } from './CodebookTableEditor.js'

const tbl = fromCSV(`ID,diagnosis,test, test2, test3, test4
0, 0, 0,abc, kli,lop
1, 0, 0,abc, kli,lop
2, 1, 1,abc, kli,lop
3, 3, 3,abc, kli,lop
4, 1, 1,abc, kli,lop
5, 2, 2,abc, kli,lop
6, 3, 3,abc, kli,lop`)
const Template: ComponentStory<typeof CodebookFieldEditor> = ({
	...args
}): JSX.Element => {
	const codebookResult = generateCodebook(tbl)
	const [field, setField] = useState(codebookResult.fields[0] as Field)

	return <CodebookFieldEditor field={field} onChange={setField} {...args} />
}
const TableTemplate: ComponentStory<typeof CodebookFieldEditor> = ({
	...args
}): JSX.Element => {
	const codebookResult = generateCodebook(tbl)
	const [fields, setFields] = useState(codebookResult.fields)

	return <CodebookTableEditor fields={fields} onChange={setFields} {...args} />
}

export const Table = TableTemplate.bind({})
Table.args = {
	showFields: DEFAULT_CODEBOOK_FIELDS,
}

const storyMetadata = {
	title: 'Components/CodebookFieldEditor',
	component: CodebookFieldEditor,
	argTypes: {
		showInlineLabel: {
			control: 'boolean',
		},
		showFields: {
			control: 'inline-check',
			options: [
				CodebookFields.DisplayName,
				CodebookFields.Description,
				CodebookFields.DataType,
				CodebookFields.DataNature,
				CodebookFields.Units,
				CodebookFields.Mapping,
			],
		},
	},
}

export const Single = Template.bind({})
Single.args = {
	showInlineLabel: true,
	showFields: DEFAULT_CODEBOOK_FIELDS,
}

export default storyMetadata
