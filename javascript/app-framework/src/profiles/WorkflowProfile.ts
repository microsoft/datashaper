/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import { Workflow } from '@datashaper/workflow'

import { WorkflowEditor } from '../components/editors/index.js'
import type { ProfilePlugin } from '../index.js'
import { ResourceGroupType } from '../index.js'

export class WorkflowProfile implements ProfilePlugin<Workflow> {
	public readonly profile = KnownProfile.Workflow
	public readonly title = 'Workflow'
	public readonly renderer = WorkflowEditor
	public readonly iconName = 'SetAction'
	public readonly group = ResourceGroupType.Data
	public readonly dataHandler = null

	public createResource(): Workflow {
		return new Workflow()
	}
}
