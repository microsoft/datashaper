/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { KnownProfile } from '@datashaper/schema'
import { Workflow } from '@datashaper/workflow'

import type { ProfilePlugin } from '../../index.js'
import { ResourceGroup, WorkflowEditor } from '../../index.js'

export class WorkflowPlugin implements ProfilePlugin<Workflow> {
	public readonly profile = KnownProfile.Workflow
	public readonly title = 'Workflow'
	public readonly renderer = WorkflowEditor
	public readonly iconName = 'SetAction'
	public readonly group = ResourceGroup.Data

	public createResource(): Workflow {
		return new Workflow()
	}
}
