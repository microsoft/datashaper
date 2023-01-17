/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, WorkflowSchema } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import type { ProfileHandler } from '../../types.js'
import { Workflow } from '../../Workflow/index.js'

export class WorkflowProfile
	implements ProfileHandler<Workflow, WorkflowSchema>
{
	public readonly profile: Profile = KnownProfile.Workflow

	public createInstance(schema: WorkflowSchema | undefined): Promise<Workflow> {
		return Promise.resolve(new Workflow(schema))
	}
}
