/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { DataTable } from '@datashaper/workflow'
import { LanguageEditor } from '../LanguageEditor/index.js'
import { useContent, useOnChange } from './DataTableTextEditor.hooks.js'
import type { DataTableTextEditorProps } from './DataTableTextEditor.types.js'

export const DataTableTextEditor: React.FC<DataTableTextEditorProps> = memo(
	function DataTableTextEditor({ resource }) {
		const dt = resource as DataTable
		const content = useContent(dt)
		const onChange = useOnChange(dt)
		return (
			<LanguageEditor
				content={content}
				onChange={onChange}
				language={'plaintext'}
			/>
		)
	},
)
