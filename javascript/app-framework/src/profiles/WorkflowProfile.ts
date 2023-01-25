/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { Workflow } from '@datashaper/workflow'
import { WorkflowProfile as WorkflowDataProfile } from '@datashaper/workflow'

import { WorkflowEditor } from '../components/editors/index.js'
import type { ProfilePlugin } from '../index.js'
import { ResourceGroupType } from '../index.js'

export class WorkflowProfile
	extends WorkflowDataProfile
	implements ProfilePlugin<Workflow>
{
	public readonly title = 'Workflow'
	public readonly renderer = WorkflowEditor
	public readonly iconName = 'SetAction'
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	public getHelp(): Record<string, string> {
		return content
	}
}
