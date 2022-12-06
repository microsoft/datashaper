/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { JsonEditor } from '../JsonEditor/JsonEditor.js'
import { useContent, useOnChange } from './CodebookEditor.hooks.js'
import type { CodebookEditorProps } from './CodebookEditor.types.js'

export const CodebookEditor: React.FC<CodebookEditorProps> = memo(
	function CodebookEditor({ resource }) {
		const content = useContent(resource)
		const onChange = useOnChange(resource)
		return <JsonEditor content={content} onChange={onChange} />
	},
)
