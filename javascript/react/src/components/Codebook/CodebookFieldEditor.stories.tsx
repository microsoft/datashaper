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

const tbl = fromCSV(`ID,diagnosis,test
0, 0, 0
1, 0, 0
2, 1, 1
3, 3, 3
4, 1, 1
5, 2, 2
6, 3, 3`)
export const Single: ComponentStory<
	typeof CodebookFieldEditor
> = (): JSX.Element => {
	const codebookResult = generateCodebook(tbl)
	const [field, setField] = useState(codebookResult.fields[0] as Field)

	return <CodebookFieldEditor field={field} onChange={setField} />
}

const storyMetadata = {
	title: 'Components/CodebookFieldEditor',
	component: CodebookFieldEditor,
}

export default storyMetadata
