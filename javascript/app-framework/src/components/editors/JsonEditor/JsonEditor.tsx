/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import Editor from '@monaco-editor/react'
import { useThematic } from '@thematic/react'
import { useDebounceFn } from 'ahooks'
import { memo } from 'react'

import type { JsonEditorProps } from './JsonEditor.types.js'

export const JsonEditor: React.FC<JsonEditorProps> = memo(function JsonEditor({
	content,
	onChange,
}) {
	const { run: handleEditorChange } = useDebounceFn(onChange, { wait: 1000 })
	const theme = useThematic()
	const themeName = theme.variant === 'dark' ? 'vs-dark' : 'light'

	return (
		<Editor
			height="90vh"
			defaultLanguage="json"
			defaultValue={content}
			value={content}
			onChange={handleEditorChange}
			theme={themeName}
		/>
	)
})
