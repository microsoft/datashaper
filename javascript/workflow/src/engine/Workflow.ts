/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	NamedOutputPortBinding,
	NamedPortBinding,
	OutputPortBinding,
	Workflow as WorkflowInput,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Observable } from 'rxjs'
import { BehaviorSubject, Subject } from 'rxjs'
import { v4 } from 'uuid'

import { DefaultGraph } from '../dataflow/DefaultGraph.js'
import { observableNode } from '../dataflow/index.js'
import type { Graph, Node } from '../dataflow/types.js'
import type { Maybe } from '../primitives.js'
import { createNode } from './createNode.js'
import { readStep } from './readStep.js'
import type { Step, StepInput } from './types.js'
import { WorkflowSchemaInstance } from './validator.js'

/**
 * The workflow object manages mutable data for a workflow specification
 */
export type TableObservable = Observable<Maybe<TableContainer>>
type TableSubject = BehaviorSubject<Maybe<TableContainer>>

export class Workflow {
	// Workflow Data Fields
	private _id?: string
	private _name?: string
	private _description?: string
	private _steps: Step[] = []
	private readonly _inputNames: Set<string> = new Set()
	private readonly _outputPorts: Map<string, NamedOutputPortBinding> = new Map()

	// Graph Workflow Details
	// The dataflow graph
	private readonly _graph: Graph<TableContainer> = new DefaultGraph()

	//
	// Output tracking - observables, data cache, subscriptions
	//
	private readonly _inputs: Map<string, TableSubject> = new Map()
	private readonly _outputs: Map<string, TableSubject> = new Map()

	// The global onChange handler
	protected readonly _onChange = new Subject<void>()

	public constructor(input?: WorkflowInput) {
		const readWorkflowInput = (workflowInput: WorkflowInput) => {
			let prev: Step | undefined
			this._id = workflowInput.id ?? v4()
			this._name = workflowInput.name
			this._description = workflowInput.description
			workflowInput.steps?.forEach(i => {
				const step = readStep(i as StepInput, prev)
				this._steps.push(step)
				prev = step
			})
			workflowInput.input?.forEach(i => this._inputNames.add(i))
			workflowInput.output?.forEach(o => {
				const binding = fixOutput(o)
				this._outputPorts.set(binding.name, binding)
			})
		}

		/**
		 * Synchronize the workflow state into the graph. Used during initialization.
		 */
		const syncWorkflowStateIntoGraph = () => {
			for (const step of this.steps) {
				this.addWorkflowStepToGraph(step)
			}
			for (const value of this.output.values()) {
				this.observeOutput(value)
			}
		}

		if (input != null) {
			readWorkflowInput(input)
		}
		syncWorkflowStateIntoGraph()
	}

	// #region Workflow Metadata
	public get id(): string | undefined {
		return this._id
	}

	public set id(input: string | undefined) {
		this._id = input
		this._onChange.next()
	}

	public get name(): string | undefined {
		return this._name
	}

	public set name(input: string | undefined) {
		this._name = input
		this._onChange.next()
	}

	public get description(): string | undefined {
		return this._description
	}

	public set description(input: string | undefined) {
		this._description = input
		this._onChange.next()
	}
	// #endregion

	// #region Graph/Node Management
	private addWorkflowStepToGraph(step: Step): void {
		const node = createNode(step)
		this._graph.add(node)
		this.configureStep(step, node)
	}

	private getNode(id: string): Node<TableContainer> {
		const graph = this._graph
		// bind to an input defined in the graph
		if (graph.hasNode(id)) {
			const result = graph.node(id)
			return result
		} else if (this.hasInputName(id)) {
			// create a new subject that we can pipe data into
			if (!this._inputs.has(id)) {
				this._inputs.set(
					id,
					new BehaviorSubject<Maybe<TableContainer>>(undefined),
				)
			}
			const source = this._inputs.get(id)!
			return observableNode(id, source)
		} else {
			throw new Error(`unknown node id or declared input: "${id}"`)
		}
	}
	// #endregion

	// #region Inputs
	public get inputNames(): Set<string> {
		return this._inputNames
	}

	public addInputName(input: string): void {
		this._inputNames.add(input)
		this._onChange.next()
	}

	public removeInputName(input: string): void {
		this._inputNames.delete(input)
		this._inputs.delete(input)
		this._onChange.next()
	}

	public hasInputName(input: string): boolean {
		return this._inputNames.has(input)
	}

	public addInputTables(inputs: TableContainer[]): void {
		// add new input tables
		for (const i of inputs) {
			this._setInputTable(i)
		}
		this.configureAllSteps()
		this._onChange.next()
	}

	public getInputTable(name: string): Maybe<TableContainer> {
		return this._inputs.get(name)?.value
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInputTable(table: TableContainer): void {
		this._setInputTable(table)
		this.configureAllSteps()
		this._onChange.next()
	}

	private _setInputTable(table: TableContainer): void {
		this.addInputName(table.id)
		if (!this._inputs.has(table.id)) {
			this._inputs.set(
				table.id,
				new BehaviorSubject<Maybe<TableContainer>>(table),
			)
		} else {
			this._inputs.get(table.id)?.next(table)
		}
	}

	// #endregion

	// #region Outputs
	public hasOutput(name: string): boolean {
		return this._outputPorts.has(name)
	}

	public hasOutputName(name: string): boolean {
		const names = []
		for (const [, binding] of this._outputPorts.entries()) {
			names.push(binding.name)
		}
		return names.includes(name)
	}

	public suggestOutputName(name: string): string {
		const originalName = name.replace(/( \(\d+\))/, '')
		let derivedName = originalName
		let count = 1

		while (this.hasOutput(derivedName)) {
			derivedName = `${originalName} (${count})`
			count++
		}
		return derivedName
	}

	public get output(): Map<string, NamedOutputPortBinding> {
		return this._outputPorts
	}

	/**
	 * Gets the output table names
	 */
	public get outputNames(): string[] {
		// todo: memoize
		return [...this._outputPorts.keys()]
	}

	public get outputDefinitions(): NamedOutputPortBinding[] {
		// todo: memoize
		return [...this._outputPorts.values()]
	}

	/**
	 * Add an output binding
	 * @param binding - The output binding
	 */
	public addOutput(output: NamedOutputPortBinding): void {
		this._outputPorts.set(output.node, output)
		this.observeOutput(output)
		this._onChange.next()
	}

	/**
	 * Remove an output binding
	 * @param name - the output name to remove
	 */
	public removeOutput(name: string): void {
		this._outputPorts.delete(name)
		this._outputs.delete(name)
		this._onChange.next()
	}

	/**
	 * Observe an output name
	 * @param name - The output to observe. If falsy, this will observe the default output of the final step.
	 */
	public outputObservable(name?: string): Maybe<TableObservable> {
		if (name != null) {
			return this._outputs.get(name)
		} else {
			return this.lastStepOutput()
		}
	}

	/**
	 * Get the latest output value
	 * @param name - The output to retrieve.  If falsy, this will observe the default output of the final step.
	 */
	public latestOutput(name?: string): Maybe<TableContainer> {
		if (name != null) {
			return this._outputs.get(name)?.value
		} else {
			return this.lastStepOutput()?.value
		}
	}

	private lastStepOutput(): Maybe<TableSubject> {
		// Returns the default output of the final node
		const lastStepId = this.steps[this.steps.length - 1]!.id
		const lastNode = this.getNode(lastStepId)
		// Nodes use BehaviorSubject internally
		return lastNode.output() as TableSubject
	}

	public outputObservableForNode(
		nodeId: string,
		nodeOutput?: string,
	): Maybe<TableSubject> {
		const output = this.outputNameForNode(nodeId, nodeOutput)
		if (output) {
			// Nodes use BehaviorSubject internally
			return this.outputObservable(output) as TableSubject
		}
	}

	public latestOutputForNode(
		nodeId: string,
		nodeOutput?: string,
	): Maybe<TableContainer> {
		const output = this.outputNameForNode(nodeId, nodeOutput)
		if (output) {
			return this.latestOutput(output)
		}
	}

	public outputNameForNode(
		nodeId: string,
		nodeOutput?: string,
	): string | undefined {
		return this.outputDefinitions.find(
			def => def.node === nodeId && def.output === nodeOutput,
		)?.name
	}

	private observeOutput({
		name,
		output,
		node: nodeId,
	}: NamedOutputPortBinding) {
		// BaseNode uses BehaviorSubject internally, which saves us some work
		const port = this.getNode(nodeId).output(output) as BehaviorSubject<
			Maybe<TableContainer>
		>
		this._outputs.set(name, port)
	}

	// #endregion

	// #region Steps
	public get steps(): Step[] {
		return this._steps
	}

	public get length(): number {
		return this._steps.length
	}

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	public addStep(stepInput: StepInput): Step {
		const step = readStep(
			stepInput,
			this._steps.length > 0 ? this.steps[this.steps.length - 1] : undefined,
		)
		// mutate the steps so that equality checks will detect that the steps changed (e.g. memo, hook deps)
		this._steps = [...this.steps, step]
		this.addWorkflowStepToGraph(step)
		this._onChange.next()
		return step
	}

	public removeStep(index: number): void {
		const step = this.steps[index]!
		const prevStep = index > 0 ? this.steps[index - 1] : undefined
		const nextStep = index + 1 < this.length ? this.steps[index + 1] : undefined
		const node = this.getNode(step.id)

		// If step was auto-bound, try to wire together the prev and next steps
		if (
			!hasDefinedInputs(step) &&
			hasPossibleInputs(node) &&
			prevStep &&
			nextStep
		) {
			// bind the output of the previous into the input of the next
			const prevNode = this.getNode(prevStep.id)
			const nextNode = this.getNode(nextStep.id)
			nextNode.bind({ node: prevNode })
		}

		// Remove step outputs from the configuration
		const stepOutputs = this.outputDefinitions.filter(o => o.node === node.id)
		stepOutputs.forEach(o => this.removeOutput(o.node))

		// Remove the step from the graph
		this._graph.remove(step.id)

		this._steps = [
			...this.steps.slice(0, index),
			...this.steps.slice(index + 1),
		]
		this._onChange.next()

		this._onChange.next()
	}

	public updateStep(stepInput: StepInput, index: number): Step {
		const prevVersion = this.steps[index]!
		const step = readStep(stepInput, this._steps[index - 1])
		const node = this.getNode(step.id)
		this._steps = [
			...this.steps.slice(0, index),
			step,
			...this.steps.slice(index + 1),
		]

		// todo: handle rename. Add graph.rename(nodeId) method
		if (prevVersion.id !== step.id) {
			throw new Error('node rename not supported yet')
		}

		// todo: add node.clearBindings() to dataflow node
		for (const binding of node.bindings()) {
			node.unbind(binding.input)
		}

		this.configureStep(step, node)

		this._onChange.next()
		return step
	}

	private configureAllSteps() {
		// bind the graph processing steps to the new input observables
		// TODO: input observable wiring should probably be managed in the DefaultGraph
		for (const step of this.steps) {
			this.configureStep(step, this._graph.node(step.id))
		}
	}

	private configureStep(step: Step, node: Node<TableContainer>) {
		node.config = step.args

		// if any inputs nodes are in the graph, bind them
		if (hasDefinedInputs(step)) {
			for (const [input, binding] of Object.entries(step.input)) {
				// Bind variadic input
				if (input === 'others') {
					const vBind = binding as NamedPortBinding[]
					node.bindVariadic(
						vBind.map(b => ({ node: this.getNode(b.node), output: b.output })),
					)
				} else {
					// Bind the named input
					const b = binding as NamedPortBinding
					const boundInput = this.getNode(b.node)
					node.bind({ input, node: boundInput, output: b.output })
				}
			}
		} else if (this.length > 0 && node.inputs.length > 0) {
			// If no named input is present, try to auto-bind to the previous node
			const prevStep = this.steps[this.length - 1]!
			node.bind({ node: this.getNode(prevStep.id) })
		}
	}

	// #endregion

	public onChange(handler: () => void, fireSync?: boolean): () => void {
		const sub = this._onChange.subscribe(handler)
		if (fireSync) {
			handler()
		}
		return () => sub.unsubscribe()
	}

	/**
	 * Gets a map of the current output tables
	 * @returns The output cache
	 */
	public toMap(): Map<string, Maybe<TableContainer>> {
		const result = new Map<string, Maybe<TableContainer>>()
		for (const [name, observable] of this._outputs) {
			result.set(name, observable.value)
		}
		return result
	}

	public toList(): Maybe<TableContainer>[] {
		return this.outputNames.map(o => this.latestOutput(o))
	}

	public toJsonObject(): WorkflowInput {
		const output: WorkflowInput['output'] = []
		for (const [, binding] of this._outputPorts.entries()) {
			output.push({ ...binding })
		}
		return {
			$schema: `https://microsoft.github.io/datashaper/schema/workflow/v1.json`,
			id: this._id ?? v4(),
			name: this._name ?? 'Workflow',
			description: this._description,
			input: [...this._inputNames.values()],
			output,
			steps: [...this.steps] as any,
		}
	}

	public static async validate(workflowJson: WorkflowInput): Promise<boolean> {
		return WorkflowSchemaInstance.isValid(workflowJson)
	}
}

function fixOutput(output: OutputPortBinding): NamedOutputPortBinding {
	if (typeof output === 'string') {
		return { name: output as string, node: output as string }
	} else {
		return output as NamedOutputPortBinding
	}
}

function hasDefinedInputs(step: Step): boolean {
	return Object.keys(step.input).length > 0
}

function hasPossibleInputs(node: Node<unknown>) {
	return node.inputs.length > 0
}
