/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	NamedOutputPortBinding,
	NamedPortBinding,
	Workflow as WorkflowInput,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Observable, Subject } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import type { Graph, Node } from '../dataflow/index.js'
import { DefaultGraph, observableNode } from '../dataflow/index.js'
import type { Maybe } from '../primitives.js'
import { createNode } from './createNode.js'
import type { Step, StepInput } from './types.js'
import { Workflow } from './Workflow.js'

// this could be used for (a) factory of step configs, (b) management of execution order
// (c) add/delete and correct reset of params, and so on
export type TableObservable = Observable<Maybe<TableContainer>>

/**
 * Manages a series of pipeline steps for interactive clients. This class specifically keeps a
 * workflow specification synchronized with a live processing graph and provides utility methods
 * for mutating the workflow.
 */
export class GraphManager extends Workflow {
	// The dataflow graph
	public readonly graph: Graph<TableContainer> = new DefaultGraph()
	public readonly inputs: Map<string, TableContainer> = new Map()

	//
	// Output tracking - observables, data cache, subscriptions
	//
	private readonly inputObservables: Map<
		string,
		Subject<Maybe<TableContainer>>
	> = new Map()
	private readonly outputObservables: Map<
		string,
		BehaviorSubject<Maybe<TableContainer>>
	> = new Map()
	private _outputNames: string[] = []
	private _outputDefinitions: NamedOutputPortBinding[] = []

	public constructor(workflowJson?: WorkflowInput) {
		super(workflowJson)
		this._syncWorkflowStateIntoGraph()
	}

	/**
	 * Synchronize the workflow state into the graph. Used during initialization.
	 */
	private _syncWorkflowStateIntoGraph() {
		for (const step of this.steps) {
			this._addWorkflowStepToGraph(step)
		}
		for (const value of this.output.values()) {
			this._bindGraphOutput(value)
		}

		this._syncOutputArrays()
	}

	public setInputs(inputs: Map<string, TableContainer>): void {
		// clear existing inputs
		this.clearInputs()

		// add new inputs
		for (const i of inputs.keys()) {
			const table = inputs.get(i) as TableContainer
			this.inputs.set(i, table)
			this.addInput(i)
		}

		// bind the graph processing steps to the new input observables
		// TODO: input observable wiring should probably be managed in the DefaultGraph
		for (const step of this.steps) {
			this._configureStep(step, this.graph.node(step.id))
		}

		// pipe input tables into graph
		for (const i of inputs.keys()) {
			const table = inputs.get(i) as TableContainer
			this.inputObservables.get(i)?.next(table)
		}

		this._onChange.next()
	}

	private _syncOutputArrays() {
		this._outputNames = [...this.outputObservables.keys()]
		this._outputDefinitions = [...this.output.values()]
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInputTable(item: TableContainer): void {
		this.addInput(item.id)
		this.inputs.set(item.id, item)
		// bind the graph processing steps to the new input observables
		// TODO: input observable wiring should probably be managed in the DefaultGraph
		for (const step of this.steps) {
			this._configureStep(step, this.graph.node(step.id))
		}
		this._onChange.next()
	}

	/**
	 * Removes a named input
	 * @param inputId - The input id to remove
	 */
	public override removeInput(inputName: string): void {
		super.removeInput(inputName)
		this.inputs.delete(inputName)
		this._onChange.next()
	}

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	public override addStep(stepInput: StepInput): Step {
		const step = super.addStep(stepInput)
		this._addWorkflowStepToGraph(step)
		this._onChange.next()
		return step
	}

	private _addWorkflowStepToGraph(step: Step): void {
		// create the graph node
		const node = createNode(step)
		this.graph.add(node)

		// wire up the graph node
		this._configureStep(step, node)
	}

	/**
	 * Deletes steps from the given index (inclusive) to the end of the array
	 * @param index - The index to delete after
	 */
	public override removeStep(index: number): void {
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
		const stepOutputs = this._outputDefinitions.filter(o => o.node === node.id)
		stepOutputs.forEach(o => this.removeOutput(o.node))

		// Remove the step from the graph
		this.graph.remove(step.id)
		super.removeStep(index)
		this._onChange.next()
	}

	public override updateStep(
		stepInput: StepInput<unknown>,
		index: number,
	): Step {
		const prevVersion = this.stepAt(index)!
		const step = super.updateStep(stepInput, index)
		const node = this.getNode(step.id)

		// todo: handle rename. Add graph.rename(nodeId) method
		if (prevVersion.id !== step.id) {
			throw new Error('node rename not supported yet')
		}

		// todo: add node.clearBindings() to dataflow node
		for (const binding of node.bindings()) {
			node.unbind(binding.input)
		}

		this._configureStep(step, node)
		this._onChange.next()
		return step
	}

	/**
	 * Add an output binding
	 * @param binding - The output binding
	 */
	public override addOutput(binding: NamedOutputPortBinding): void {
		super.addOutput(binding)
		this._bindGraphOutput(binding)
		this._syncOutputArrays()
		this._onChange.next()
	}

	/**
	 * Remove an output binding
	 * @param name - the output name to remove
	 */
	public override removeOutput(name: string): void {
		super.removeOutput(name)
		this.outputObservables.delete(name)
		this._syncOutputArrays()
		this._onChange.next()
	}

	private _bindGraphOutput(binding: NamedOutputPortBinding) {
		const { name, output, node: nodeId } = binding

		// Register the output in the table store
		const node = this.getNode(nodeId)

		// BaseNode uses behaviorSubject internally, which saves us some headache
		const port = node.output(output) as BehaviorSubject<Maybe<TableContainer>>
		this.outputObservables.set(name, port)
	}

	/**
	 * Gets the output table names
	 */
	public get outputs(): string[] {
		return this._outputNames
	}

	public get outputDefinitions(): NamedOutputPortBinding[] {
		return this._outputDefinitions
	}

	/**
	 * Observe an output name
	 * @param name - The output to observe
	 */
	public outputObservable(name: string): Maybe<TableObservable> {
		return this.outputObservables.get(name)
	}

	/**
	 * Get the latest output value
	 * @param name - The output to retrieve
	 */
	public latestOutput(name: string): Maybe<TableContainer> {
		return this.outputObservables.get(name)?.value
	}

	public outputObservableForNode(
		nodeId: string,
		nodeOutput?: string,
	): Maybe<TableObservable> {
		const output = this.outputNameForNode(nodeId, nodeOutput)
		if (output) {
			return this.outputObservable(output)
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

	/**
	 * Gets a map of the current output tables
	 * @returns The output cache
	 */
	public toMap(): Map<string, Maybe<TableContainer>> {
		const result = new Map<string, Maybe<TableContainer>>()
		for (const [name, observable] of this.outputObservables) {
			result.set(name, observable.value)
		}
		return result
	}

	public toList(): Maybe<TableContainer>[] {
		return this.outputs.map(o => this.latestOutput(o))
	}

	private _configureStep(step: Step, node: Node<TableContainer>) {
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

	private getNode(id: string): Node<TableContainer> {
		const graph = this.graph
		// bind to an input defined in the graph
		if (graph.hasNode(id)) {
			const result = graph.node(id)
			return result
		} else if (this.hasInput(id)) {
			// create a new subject that we can pipe data into
			const source = new BehaviorSubject<TableContainer | undefined>(
				this.inputs.get(id),
			)

			// define the new graph node
			this.inputObservables.set(id, source)
			return observableNode(id, source)
		} else {
			throw new Error(`unknown node id or declared input: "${id}"`)
		}
	}
}

function hasDefinedInputs(step: Step): boolean {
	return Object.keys(step.input).length > 0
}

function hasPossibleInputs(node: Node<unknown>) {
	return node.inputs.length > 0
}
