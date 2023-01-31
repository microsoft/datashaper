/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import Editor from '@monaco-editor/react'
import { useThematic } from '@thematic/react'
import { useDebounceFn } from 'ahooks'
import { memo } from 'react'
import styled from 'styled-components'

import type { JsonEditorProps } from './JsonEditor.types.js'

const options = {
	minimap: {
		enabled: false,
	},
}
export const JsonEditor: React.FC<JsonEditorProps> = memo(function JsonEditor({
	content,
	language = 'json',
	onChange,
}) {
	const { run: handleEditorChange } = useDebounceFn(onChange, { wait: 1000 })
	const theme = useThematic()
	const themeName = theme.dark ? 'vs-dark' : 'light'

	return (
		<Container>
			<Editor
				height="90vh"
				language={language}
				defaultValue={content}
				value={content}
				onChange={handleEditorChange}
				theme={themeName}
				options={options}
			/>
		</Container>
	)
})

const Container = styled.div`
	padding-top: 10px;
`
