/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import content from '@datashaper/guidance'
import type { Workflow } from '@datashaper/workflow'
import { WorkflowProfile } from '@datashaper/workflow'

import { WorkflowRenderer } from './renderers/WorkflowRenderer.js'
import type { AppProfile } from '../index.js'
import { ResourceGroupType } from '../index.js'
import { profileIcons } from './icons.js'

export class WorkflowAppProfile
	extends WorkflowProfile
	implements AppProfile<Workflow>
{
	public readonly title = 'Workflow'
	public readonly renderer = WorkflowRenderer
	public readonly iconName = profileIcons.workflow
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	public getHelp(): Record<string, string> {
		return content
	}
}
