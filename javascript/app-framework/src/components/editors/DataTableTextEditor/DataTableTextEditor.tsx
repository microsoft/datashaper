/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { DataTable } from '@datashaper/workflow'
import { LanguageEditor } from '../LanguageEditor/index.js'
import { useContent, useOnChange } from './DataTableTextEditor.hooks.js'
import type { PluginComponentProps } from '../../../types.js'

export const DataTableTextEditor: React.FC<PluginComponentProps<DataTable>> =
	memo(function DataTableTextEditor({ resource }) {
		const content = useContent(resource)
		const onChange = useOnChange(resource)
		return (
			<LanguageEditor
				content={content}
				onChange={onChange}
				language={'plaintext'}
			/>
		)
	})
