import type { WorkflowArgs } from '@datashaper/schema'
import { TableObservable, Workflow } from '../resources/Workflow/Workflow.js'
import { BaseNode } from '../dataflow/index.js'
import { TableContainer } from '@datashaper/tables'
import { Subscription } from 'rxjs'

class WorkflowNode extends BaseNode<TableContainer, WorkflowArgs> {
	private _workflow: Workflow | null = null
	private _outputSub: Subscription | null = null

	constructor(id: string) {
		super()
		this.id = id

		this.config$.subscribe((config) => {
			// Clean up existing workflow
			if (this._outputSub != null) {
				this._outputSub.unsubscribe()
			}
			if (this._workflow != null) {
				this._workflow.dispose()
			}

			// Check that the new configuration is valid
			if (config == null) {
				this._workflow = null
				return
			}

			// Set up the new workflow
			this._workflow = new Workflow(config?.workflow)

			// set the default input
			this._workflow.input$ = this.inputValue$()

			// Listen to the workflow outputs
			this._outputSub = this._workflow.output$.subscribe((output) => {
				this.emit(output)
			})
		})
	}

	protected doRecalculate(): void | Promise<void> {
		// no need, the workflow will handle this
	}
}

export function workflow(id: string): WorkflowNode {
	return new WorkflowNode(id)
}
