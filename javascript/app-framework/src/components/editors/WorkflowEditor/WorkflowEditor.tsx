/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useHelpOnMount } from '../../../hooks/useHelpOnMount.js'
import { ResourceSchemaEditor } from '../ResourceSchemaEditor/index.js'
import type { WorkflowEditorProps } from './WorkflowEditor.types.js'

export const WorkflowEditor: React.FC<WorkflowEditorProps> = memo(
	function WorkflowEditor({ resource }) {
		useHelpOnMount('resources.workflow.index')
		return <ResourceSchemaEditor resource={resource} />
	},
)
