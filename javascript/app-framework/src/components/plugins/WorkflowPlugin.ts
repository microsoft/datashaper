import { KnownProfile } from '@datashaper/schema'
import { Workflow } from '@datashaper/workflow'
import { WorkflowEditor, ResourceGroup, ProfilePlugin } from '../../index.js'

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
