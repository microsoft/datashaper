/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import { JsonEditor } from '../JsonEditor/JsonEditor.js'
import { useContent, useOnChange } from './WorkflowEditor.hooks.js'
import type { WorkflowEditorProps } from './WorkflowEditor.types.js'

export const WorkflowEditor: React.FC<WorkflowEditorProps> = memo(
	function WorkflowEditor({ resource }) {
		const content = useContent(resource)
		const onChange = useOnChange(resource)
		return <JsonEditor content={content} onChange={onChange} />
	},
)
