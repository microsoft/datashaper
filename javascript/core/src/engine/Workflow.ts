import { readStep } from '../steps/readStep.js'
import type { WorkflowObject, Step, StepInput } from '../steps/types.js'
import type { NamedOutputPortBinding, OutputPortBinding } from '../types.js'

/**
 * The workflow object manages mutable data for a workflow specification
 */
export class Workflow {
	private _steps: Step[] = []
	private _input: Set<string> = new Set()
	private _output: Map<string, NamedOutputPortBinding> = new Map()

	public constructor(workflowJson?: WorkflowObject) {
		let prev: Step | undefined
		workflowJson?.steps.forEach(i => {
			const step = readStep(i, prev)
			this._steps.push(readStep(step, prev))
			prev = step
		})
		workflowJson?.input?.forEach(i => this._input.add(i))
		workflowJson?.output?.forEach(o => {
			const binding = fixOutput(o)
			this._output.set(binding.name, binding)
		})
	}

	public get input() {
		return this._input
	}

	public get output() {
		return this._output
	}

	public get steps(): Step[] {
		return this._steps
	}

	public get length(): number {
		return this._steps.length
	}

	public addInput(input: string): void {
		this._input.add(input)
	}

	public removeInput(input: string): void {
		this._input.delete(input)
	}

	public hasInput(input: string): boolean {
		return this._input.has(input)
	}

	public addOutput(output: NamedOutputPortBinding) {
		this._output.set(output.name, output)
	}

	public removeOutput(name: string) {
		this._output.delete(name)
	}

	public hasOutput(name: string) {
		return this._output.has(name)
	}

	public stepAt(index: number): Step | undefined {
		return this._steps[index]
	}

	public addStep(stepInput: StepInput): Step {
		const step = readStep(stepInput)
		// mutate the steps so that equality checks will detect that the steps changed (e.g. memo, hook deps)
		this._steps = [...this.steps, step]
		return step
	}

	public updateStep(stepInput: StepInput, index: number): Step {
		const step = readStep(stepInput, this._steps[index - 1])
		this._steps[index] = step
		return step
	}

	public clear() {
		this._steps = []
		this._input.clear()
		this._output.clear()
	}

	public toJsonObject(): WorkflowObject {
		const output: WorkflowObject['output'] = []
		for (const [name, binding] of this._output.entries()) {
			output.push({ ...binding, name })
		}

		return {
			input: [...this._input.values()],
			output,
			steps: [...this.steps],
		}
	}
}

function fixOutput(output: OutputPortBinding): NamedOutputPortBinding {
	if (typeof output === 'string') {
		return { name: output as string, node: output as string }
	} else {
		return output as NamedOutputPortBinding
	}
}
