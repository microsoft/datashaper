/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	NamedOutputPortBinding,
	OutputPortBinding,
} from '@datashaper/schema'
import { Subject } from 'rxjs'

import { cloneStep } from '../util/index.js'
import { readStep } from './readStep.js'
import type { Step, StepInput, WorkflowObject } from './types.js'
import { WorkflowSchemaInstance } from './validator.js'

/**
 * The workflow object manages mutable data for a workflow specification
 */
export class Workflow {
	private _name?: string
	private _description?: string
	private _steps: Step[] = []
	private _input: Set<string> = new Set()
	private _outputs: Map<string, NamedOutputPortBinding> = new Map()

	// The global onChange handler
	private readonly _onChange = new Subject<void>()

	public constructor(workflowJson?: WorkflowObject) {
		if (workflowJson != null) {
			this.init(workflowJson)
		}
	}

	protected init(workflowJson: WorkflowObject) {
		let prev: Step | undefined
		this._name = workflowJson.name
		this._description = workflowJson.description
		workflowJson.steps.forEach(i => {
			const step = readStep(i, prev)
			this._steps.push(step)
			prev = step
		})
		workflowJson.input?.forEach(i => this._input.add(i))
		workflowJson.output?.forEach(o => {
			const binding = fixOutput(o)
			this._outputs.set(binding.name, binding)
		})
	}

	public clone(): Workflow {
		const clone = new Workflow()
		clone._steps = this._steps.map(x => cloneStep(x))
		clone._input = new Set(this._input)
		clone._outputs = new Map(this._outputs)
		return clone
	}

	public static async validate(workflowJson: WorkflowObject): Promise<boolean> {
		return WorkflowSchemaInstance.isValid(workflowJson)
	}

	public get input(): Set<string> {
		return this._input
	}

	public get outputs(): Map<string, NamedOutputPortBinding> {
		return this._outputs
	}

	public get steps(): Step[] {
		return this._steps
	}

	public get length(): number {
		return this._steps.length
	}

	public addInput(input: string): void {
		this._addInput(input)
		this.fireOnChange()
	}

	protected _addInput(input: string): void {
		this._input.add(input)
	}

	public removeInput(input: string): void {
		this._removeInput(input)
		this.fireOnChange()
	}

	protected _removeInput(input: string): void {
		this._input.delete(input)
	}

	public hasInput(input: string): boolean {
		return this._input.has(input)
	}

	public addOutput(output: NamedOutputPortBinding): void {
		this._addOutput(output)
		this.fireOnChange()
	}

	protected _addOutput(output: NamedOutputPortBinding): void {
		this._outputs.set(output.name, output)
	}

	public removeOutput(name: string): void {
		this._removeOutput(name)
		this.fireOnChange()
	}

	protected _removeOutput(name: string) {
		this._outputs.delete(name)
	}

	public hasOutput(name: string): boolean {
		return this._outputs.has(name)
	}

	public stepAt(index: number): Step | undefined {
		return this._steps[index]
	}

	public addStep(stepInput: StepInput): Step {
		const step = this._addStep(stepInput)
		this.fireOnChange()
		return step
	}

	protected _addStep(stepInput: StepInput): Step {
		const step = readStep(
			stepInput,
			this._steps.length > 0 ? this.steps[this.steps.length - 1] : undefined,
		)
		// mutate the steps so that equality checks will detect that the steps changed (e.g. memo, hook deps)
		this._steps = [...this.steps, step]
		return step
	}

	public removeStep(index: number): void {
		this._steps = [
			...this.steps.slice(0, index),
			...this.steps.slice(index + 1),
		]
		this.fireOnChange()
	}

	public updateStep(stepInput: StepInput, index: number): Step {
		const step = this._updateStep(stepInput, index)
		this.fireOnChange()
		return step
	}

	protected _updateStep(stepInput: StepInput, index: number): Step {
		const step = readStep(stepInput, this._steps[index - 1])
		this._steps = [
			...this.steps.slice(0, index),
			step,
			...this.steps.slice(index + 1),
		]
		return step
	}

	public clear(): void {
		this._steps = []
		this._input.clear()
		this._outputs.clear()
		this.fireOnChange()
	}

	public onChange(handler: () => void): () => void {
		const sub = this._onChange.subscribe(handler)
		return () => sub.unsubscribe()
	}

	public toJsonObject(): WorkflowObject {
		const output: WorkflowObject['output'] = []
		for (const [name, binding] of this._outputs.entries()) {
			output.push({ ...binding, name })
		}
		return {
			$schema: `https://microsoft.github.io/datashaper/schema/workflow/v3.json`,
			name: this._name,
			description: this._description,
			input: [...this._input.values()],
			output,
			steps: [...this.steps],
		}
	}

	protected fireOnChange() {
		this._onChange.next()
	}
}

function fixOutput(output: OutputPortBinding): NamedOutputPortBinding {
	if (typeof output === 'string') {
		return { name: output as string, node: output as string }
	} else {
		return output as NamedOutputPortBinding
	}
}
