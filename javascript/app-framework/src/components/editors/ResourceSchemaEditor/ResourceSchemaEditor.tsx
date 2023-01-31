/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { LanguageEditor } from '../LanguageEditor/index.js'
import { useContent, useOnChange } from './ResourceSchemaEditor.hooks.js'
import type { ResourceSchemaEditorProps } from './ResourceSchemaEditor.types.js'

export const ResourceSchemaEditor: React.FC<ResourceSchemaEditorProps> = memo(
	function ResourceSchemaEditor({ resource }) {
		const content = useContent(resource)
		const onChange = useOnChange(resource)
		return (
			<LanguageEditor content={content} onChange={onChange} language={'json'} />
		)
	},
)
