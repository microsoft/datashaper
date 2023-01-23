/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@datashaper/workflow'
import type { PluginComponentProps } from '../types.js'

export interface WorkflowEditorProps extends PluginComponentProps {
	resource: Workflow
}
