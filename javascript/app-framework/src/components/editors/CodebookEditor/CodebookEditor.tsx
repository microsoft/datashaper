/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Codebook } from '@datashaper/react'
import { useObservableState } from 'observable-hooks'
import { memo, useEffect } from 'react'

import { JsonModeEditor } from '../JsonModeEditor/JsonModeEditor.js'
import { useOnFieldsChanged } from './CodebookEditor.hooks.js'
import type { CodebookEditorProps } from './CodebookEditor.types.js'

export const CodebookEditor: React.FC<CodebookEditorProps> = memo(
	function CodebookEditor({ resource, api, styles }) {
		const handleFieldsChanged = useOnFieldsChanged(resource)
		const fields = useObservableState(resource.fields$, resource.fields)
		useEffect(() => api.requestHelp('codebook'), [api])
		return (
			<JsonModeEditor resource={resource}>
				<Codebook
					fields={fields}
					onChangeFields={handleFieldsChanged}
					styles={styles}
				/>
			</JsonModeEditor>
		)
	},
)
