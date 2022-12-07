/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CodebookTableEditor } from '@datashaper/react'
import { useObservableState } from 'observable-hooks'
import { memo } from 'react'

import { JsonModeEditor } from '../JsonModeEditor/JsonModeEditor.js'
import { useOnFieldsChanged } from './CodebookEditor.hooks.js'
import type { CodebookEditorProps } from './CodebookEditor.types.js'

export const CodebookEditor: React.FC<CodebookEditorProps> = memo(
	function CodebookEditor({ resource }) {
		const handleFieldsChanged = useOnFieldsChanged(resource)
		const fields = useObservableState(resource.fields$, resource.fields)

		return (
			<JsonModeEditor resource={resource}>
				<CodebookTableEditor
					fields={fields}
					onChangeFields={handleFieldsChanged}
				/>
			</JsonModeEditor>
		)
	},
)
