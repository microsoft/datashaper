/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	NamedOutputPortBinding,
	NamedPortBinding,
	OutputPortBinding,
	WorkflowSchema,
} from '@datashaper/schema'
import { createWorkflowSchemaObject } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject, of } from 'rxjs'

import { DefaultGraph } from '../dataflow/DefaultGraph.js'
import { observableNode } from '../dataflow/index.js'
import type { Graph, Node } from '../dataflow/types.js'
import { createNode } from '../engine/createNode.js'
import { readStep } from '../engine/readStep.js'
import type { Step, StepInput } from '../engine/types.js'
import { WorkflowSchemaInstance } from '../engine/validator.js'
import type { Maybe } from '../primitives.js'
import { Resource } from './Resource.js'
import type { SchemaResource } from './types.js'

/**
 * The workflow object manages mutable data for a workflow specification
 */
export type TableObservable = Observable<Maybe<TableContainer>>
type TableSubject = BehaviorSubject<Maybe<TableContainer>>

export class Workflow
	extends Resource
	implements SchemaResource<WorkflowSchema>
{
	// Workflow Data FieldsF
	private _steps: Step[] = []
	private readonly _inputNames: Set<string> = new Set()
	private readonly _outputPorts: Map<string, NamedOutputPortBinding> = new Map()

	private _lastStepSubscription: Subscription | undefined
	private readonly _defaultOutput = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	// Graph Workflow Details
	// The dataflow graph
	private readonly _graph: Graph<TableContainer> = new DefaultGraph()

	//
	// Output tracking - observables, data cache, subscriptions
	//
	private readonly _inputs: Map<string, TableSubject> = new Map()
	private readonly _outputs: Map<string, TableSubject> = new Map()

	public constructor(input?: WorkflowSchema, private _strictInputs = false) {
		super()
		this.loadSchema(input)
	}

	private rebindDefaultOutput() {
		if (this._lastStepSubscription) {
			this._lastStepSubscription.unsubscribe()
		}
		this._lastStepSubscription = this.lastStepOutput()?.subscribe(value =>
			this._defaultOutput.next(value),
		)
	}

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

	public getInputTable(name: string): Maybe<TableContainer> {
		return this._inputs.get(name)?.value
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInputObservable(id: string, source: TableObservable): void {
		this._assertInputName(id)

		this._bindInputObservable(id, source)

		this.configureAllSteps()
		this._onChange.next()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInputObservables(values: Map<string, TableObservable>): void {
		for (const id of values.keys()) {
			this._assertInputName(id)
		}

		for (const [id, source] of values.entries()) {
			this._bindInputObservable(id, source)
		}

		this.configureAllSteps()
		this._onChange.next()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 * @param id - the input name to bind this table to (default will be the table id)
	 */
	public addInputTable(table: TableContainer, id = table.id): void {
		this.addInputObservable(id, of(table))
	}

	public addInputTables(inputs: TableContainer[]): void {
		const map = new Map<string, Observable<Maybe<TableContainer>>>()
		inputs.forEach(i => map.set(i.id, of(i)))
		this.addInputObservables(map)
	}

	private _bindInputObservable(id: string, source: TableObservable): void {
		if (this._graph.hasNode(id)) {
			this._graph.remove(id)
		}

		const subject = new BehaviorSubject<Maybe<TableContainer>>(undefined)
		source.subscribe(s => subject.next(s))
		this._inputs.set(id, subject)

		this._graph.add(observableNode(id, source))
	}

	private _assertInputName(id: string): void {
		if (!this.hasInputName(id)) {
			if (this._strictInputs) {
				throw new Error(`input name ${id} not declared`)
			} else {
				this.addInputName(id)
			}
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

	public get outputPorts(): Map<string, NamedOutputPortBinding> {
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
			return this._defaultOutput
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
			return this._defaultOutput.value
		}
	}

	private lastStepOutput(): Maybe<TableSubject> {
		// Returns the default output of the final node
		if (this.length === 0) return undefined
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

		// Use this new step's output as the default output for the workflow
		this.rebindDefaultOutput()

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

	/**
	 * Gets a map of the current output tables
	 * @returns The output cache
	 */
	public toMap(includeInputs = false): Map<string, Maybe<TableContainer>> {
		const result = new Map<string, Maybe<TableContainer>>()
		if (includeInputs) {
			for (const [name, observable] of this._inputs) {
				result.set(name, observable.value)
			}
		}
		for (const [name, observable] of this._outputs) {
			result.set(name, observable.value)
		}
		return result
	}

	public toArray(includeInputs = false): Maybe<TableContainer>[] {
		const result: Maybe<TableContainer>[] = []
		if (includeInputs) {
			for (const [, observable] of this._inputs) {
				result.push(observable.value)
			}
		}
		for (const [, observable] of this._outputs) {
			result.push(observable.value)
		}
		return result
	}

	public override toSchema(): WorkflowSchema {
		const output: WorkflowSchema['output'] = []
		for (const [, binding] of this._outputPorts.entries()) {
			output.push({ ...binding })
		}
		return createWorkflowSchemaObject({
			...super.toSchema(),
			input: [...this._inputNames.values()],
			output,
			steps: [...this.steps] as any,
		})
	}

	public override loadSchema(schema: WorkflowSchema | null | undefined): void {
		super.loadSchema(schema)
		this.readWorkflowInput(schema ?? createWorkflowSchemaObject({ output: [] }))
		this.syncWorkflowStateIntoGraph()
	}

	private readWorkflowInput(schema: WorkflowSchema) {
		let prev: Step | undefined

		/** remove any existing output pipe */
		this._steps = []
		schema.steps?.forEach(i => {
			const step = readStep(i as StepInput, prev)
			this._steps.push(step)
			prev = step
		})

		this._outputPorts.clear()
		this._inputNames.clear()
		schema.input?.forEach(i => this._inputNames.add(i))
		schema.output?.forEach(o => {
			const binding = fixOutput(o)
			this._outputPorts.set(binding.name, binding)
		})

		this.rebindDefaultOutput()
	}

	/**
	 * Synchronize the workflow state into the graph. Used during initialization.
	 */
	private syncWorkflowStateIntoGraph() {
		this._graph.clear()
		for (const step of this.steps) {
			this.addWorkflowStepToGraph(step)
		}
		for (const value of this.outputPorts.values()) {
			this.observeOutput(value)
		}
	}

	public static async validate(workflowJson: WorkflowSchema): Promise<boolean> {
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
