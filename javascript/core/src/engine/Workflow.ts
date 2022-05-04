import { Subject } from 'rxjs'
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

	// The global onChange handler
	private readonly _onChange = new Subject<void>()

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
		this._onChange.next()
	}

	public removeInput(input: string): void {
		this._input.delete(input)
		this._onChange.next()
	}

	public hasInput(input: string): boolean {
		return this._input.has(input)
	}

	public addOutput(output: NamedOutputPortBinding) {
		this._output.set(output.name, output)
		this._onChange.next()
	}

	public removeOutput(name: string) {
		this._output.delete(name)
		this._onChange.next()
	}

	public hasOutput(name: string) {
		return this._output.has(name)
	}

	public stepAt(index: number): Step | undefined {
		return this._steps[index]
	}

	public addStep(stepInput: StepInput): Step {
		const step = readStep(
			stepInput,
			this._steps.length > 0 ? this.steps[this.steps.length - 1] : undefined,
		)
		// mutate the steps so that equality checks will detect that the steps changed (e.g. memo, hook deps)
		this._steps = [...this.steps, step]
		this._onChange.next()
		return step
	}

	public updateStep(stepInput: StepInput, index: number): Step {
		const step = readStep(stepInput, this._steps[index - 1])
		this._steps[index] = step
		this._onChange.next()
		return step
	}

	public clear() {
		this._steps = []
		this._input.clear()
		this._output.clear()
		this._onChange.next()
	}

	public onChange(handler: () => void): () => void {
		const sub = this._onChange.subscribe(handler)
		return () => sub.unsubscribe()
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
