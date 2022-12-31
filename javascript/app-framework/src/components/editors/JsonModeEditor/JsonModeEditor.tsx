/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'

import { JsonEditor } from '../JsonEditor/JsonEditor.js'
import { useJsonContent, useOnChange } from './JsonModeEditor.hooks.js'
import type { JsonModeEditorProps } from './JsonModeEditor.types.js'
import { ViewOptions } from './ViewOptions.js'
import { ViewType } from './ViewOptions.types.js'

export const JsonModeEditor: React.FC<JsonModeEditorProps> = memo(
	function JsonModeEditor({ resource, children }) {
		const [viewType, setViewType] = useState(ViewType.Interactive)
		const content = useJsonContent(resource)
		const onChange = useOnChange(resource)
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
