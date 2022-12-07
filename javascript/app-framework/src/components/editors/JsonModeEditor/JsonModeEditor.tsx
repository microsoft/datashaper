/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'

import { JsonEditor } from '../JsonEditor/JsonEditor.js'
import { ViewType } from '../ViewOptions/index.js'
import { ViewOptions } from '../ViewOptions/ViewOptions.js'
import { useJsonContent, useOnChange } from './JsonModeEditor.hooks.js'
import type { JsonModeEditorProps } from './JsonModeEditor.types.js'

export const JsonModeEditor: React.FC<JsonModeEditorProps> = memo(
	function JsonModeEditor({ resource: dataTable, children }) {
		const [viewType, setViewType] = useState(ViewType.Interactive)
		const content = useJsonContent(dataTable)
		const onChange = useOnChange(dataTable)

		return (
			<>
				<ViewOptions selected={viewType} onChange={setViewType} />
				{viewType === ViewType.Interactive ? (
					children
				) : (
					<JsonEditor content={content} onChange={onChange} />
				)}
			</>
		)
	},
)
