import { KnownProfile, Profile, WorkflowSchema } from '@datashaper/schema'
import { Workflow } from '../../Workflow/index.js'
import type { ProfileHandler } from '../../types.js'
import type { Resource } from '../../Resource.js'

export class WorkflowProfile implements ProfileHandler {
	public readonly profile: Profile = KnownProfile.Workflow

	public async createInstance(
		schema: WorkflowSchema | undefined,
	): Promise<Resource> {
		return new Workflow(schema)
	}
}
