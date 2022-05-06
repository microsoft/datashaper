/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import type { Graph, Node } from '@essex/dataflow'
import { DefaultGraph, observableNode } from '@essex/dataflow'
import type { Observable, Subscription } from 'rxjs'
import { from, Subject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import type { Step, StepInput } from '../steps/index.js'
import type { NamedOutputPortBinding, NamedPortBinding } from '../types.js'
import { createNode } from './createNode.js'
import { Workflow } from './Workflow.js'

// this could be used for (a) factory of step configs, (b) management of execution order
// (c) add/delete and correct reset of params, and so on

export type TableObservable = Observable<Maybe<TableContainer>>
/**
 * Manages a series of pipeline steps for interactive clients. This class specifically keeps a
 * workflow specification synchronized with a live processing graph and provides utility methods
 * for mutating the workflow.
 */
export class GraphManager {
	// The dataflow graph
	private readonly _graph: Graph<TableContainer> = new DefaultGraph()

	// The global onChange handler
	private readonly _onChange = new Subject<void>()

	//
	// Output tracking - observables, data cache, subscriptions
	//
	private readonly outputObservables: Map<string, TableObservable> = new Map()
	private readonly outputCache: Map<string, Maybe<TableContainer>> = new Map()
	private readonly outputSubscriptions: Map<string, Subscription> = new Map()
	private _outputNames: string[] = []
	private _outputDefinitions: NamedOutputPortBinding[] = []

	public constructor(
		private readonly _inputs: Map<string, TableContainer> = new Map(),
		private _workflow: Workflow,
	) {
		this._syncWorkflowStateIntoGraph()
	}

	/**
	 * Synchronize the workflow state into the graph. Used during initialization.
	 */
	private _syncWorkflowStateIntoGraph() {
		for (const i of this._inputs.keys()) {
			this._workflow.addInput(i)
		}
		for (const step of this._workflow.steps) {
			this._addWorkflowStepToGraph(step)
		}
		for (const value of this._workflow.output.values()) {
			this._bindGraphOutput(value)
		}

		this._syncOutputArrays()
	}

	private _syncOutputArrays() {
		this._outputNames = [...this.outputObservables.keys()]
		this._outputDefinitions = [...this._workflow.output.values()]
	}

	public get inputs(): Map<string, TableContainer> {
		return this._inputs
	}

	public get graph(): Graph<TableContainer> {
		return this._graph
	}

	public get workflow(): Workflow {
		return this._workflow
	}

	/**
	 * The number of steps in the workflow
	 */
	public get numSteps(): number {
		return this._workflow.length
	}

	/**
	 * The steps in the worfklow
	 */
	public get steps(): Step[] {
		return this._workflow.steps
	}

	public hasInput(name: string): boolean {
		return this.inputs.has(name)
	}

	public hasOutput(name: string): boolean {
		return this.outputObservables.has(name)
	}

	/**
	 * Remove all steps, inputs, and outputs from the pipeline
	 */
	public reset(workflow?: Workflow): void {
		this._workflow.clear()
		this.graph.nodes.forEach(id => this._graph.remove(id))

		// if a new workflow is injected, sync it into the graph
		if (workflow != null) {
			this._workflow = workflow
			this._syncWorkflowStateIntoGraph()
		}
		//todo: add graph.clear
		//this._graph.clear()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInput(item: TableContainer): void {
		this._workflow.addInput(item.id)
		this.inputs.set(item.id, item)
		this._onChange.next()
	}

	/**
	 * Removes a named input
	 * @param inputId - The input id to remove
	 */
	public removeInput(inputName: string): void {
		this._workflow.removeInput(inputName)
		this.inputs.delete(inputName)
		this._onChange.next()
	}

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	public addStep(stepInput: StepInput): Step {
		const step = this._workflow.addStep(stepInput)
		this._addWorkflowStepToGraph(step)
		this._onChange.next()
		return step
	}

	private _addWorkflowStepToGraph(step: Step): void {
		// create the graph node
		const node = createNode(step)
		this._graph.add(node)

		// wire up the graph node
		this._configureStep(step, node)
	}

	/**
	 * Deletes steps from the given index (inclusive) to the end of the array
	 * @param index - The index to delete after
	 */
	public removeStep(index: number): void {
		const step = this._workflow.steps[index]!
		const prevStep = index > 0 ? this._workflow.steps[index - 1] : undefined
		const nextStep =
			index + 1 < this.numSteps ? this._workflow.steps[index + 1] : undefined
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
		stepOutputs.forEach(o => this.removeOutput(o.name))

		// Remove the step from the graph
		this._graph.remove(step.id)
		this.workflow.removeStep(index)
		this._onChange.next()
	}

	/**
	 * Reconfigure a step at an index
	 * @param index - The step index
	 * @param step - The step specification
	 */
	public reconfigureStep(index: number, stepInput: StepInput<unknown>): Step {
		const prevVersion = this._workflow.stepAt(index)!
		const step = this._workflow.updateStep(stepInput, index)
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
	public addOutput(binding: NamedOutputPortBinding): void {
		this._workflow.addOutput(binding)
		this._bindGraphOutput(binding)
		this._syncOutputArrays()
		this._onChange.next()
	}

	/**
	 * Remove an output binding
	 * @param name - the output name to remove
	 */
	public removeOutput(name: string): void {
		this._workflow.removeOutput(name)
		this.outputObservables.delete(name)
		this.outputSubscriptions.get(name)?.unsubscribe()
		this.outputSubscriptions.delete(name)
		this.outputCache.delete(name)
		this._syncOutputArrays()
		this._onChange.next()
	}

	private _bindGraphOutput(binding: NamedOutputPortBinding) {
		const { name, output, node } = binding

		// Register the output in the table store
		const port = this.getNode(node).output(output)
		this.outputObservables.set(name, port)
		const subscription = port.subscribe(latest => {
			this.outputCache.set(name, { ...latest, id: name, name })
			this._onChange.next()
		})
		this.outputSubscriptions.set(name, subscription)
	}

	/**
	 * Log out the steps
	 */
	public print(): void {
		console.log(this._workflow.steps)
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
	public output(name: string): Maybe<TableObservable> {
		return this.outputObservables.get(name)
	}

	public outputForNodeId(
		nodeId: string,
		nodeOutput?: string,
	): Maybe<TableObservable> {
		const output = this.outputNameForNode(nodeId, nodeOutput)
		if (output) {
			return this.output(output)
		}
	}

	/**
	 * Get the latest output value
	 * @param name - The output to retrieve
	 */
	public latest(name: string): Maybe<TableContainer> {
		return this.outputCache.get(name)
	}

	public latestForNodeId(
		nodeId: string,
		nodeOutput?: string,
	): Maybe<TableContainer> {
		const output = this.outputNameForNode(nodeId, nodeOutput)
		if (output) {
			return this.latest(output)
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
	 * Suggests a new table name given the root. If the root is
	 * used, this will append numbers to the end.
	 * e.g. "join" may result in "join 1" or "join 2" if there are
	 * collisions
	 *
	 * @param name - the proposed name
	 */
	public suggestOutputName(name: string): string {
		const originalName = name.replace(/( \(\d+\))/, '')
		let derivedName = originalName
		let count = 1

		while (this._workflow.hasOutput(derivedName)) {
			derivedName = `${originalName} (${count})`
			count++
		}
		return derivedName
	}

	/**
	 * Gets a map of the current output tables
	 * @returns The output cache
	 */
	public toMap(): Map<string, Maybe<TableContainer>> {
		return this.outputCache
	}

	public toList(): Maybe<TableContainer>[] {
		return this.outputs.map(o => this.latest(o))
	}

	/**
	 * Listen to changes in the Workflow graph
	 * @param handler - The onChange handler
	 */
	public onChange(handler: () => void): () => void {
		const sub = this._onChange.subscribe(handler)
		return () => sub.unsubscribe()
	}

	private _configureStep(step: Step, node: Node<TableContainer>) {
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
					node.bind({ input, node: this.getNode(b.node), output: b.output })
				}
			}
		} else if (this._workflow.steps.length > 0 && node.inputs.length > 0) {
			// If no named input is present, try to auto-bind to the previous node
			const prevStep = this._workflow.steps[this._workflow.steps.length - 1]!
			node.bind({ node: this.getNode(prevStep.id) })
		}
	}

	private getNode(id: string): Node<TableContainer> {
		const graph = this.graph
		// bind to an input defined in the graph
		if (graph.hasNode(id)) {
			return graph.node(id)
		} else if (this._workflow.hasInput(id)) {
			// bind to a declared input
			return observableNode(id, from([this.inputs.get(id)]))
		} else {
			throw new Error(`unknown node id or declared input: "${id}"`)
		}
	}
}

export function createGraphManager(
	inputs?: Map<string, TableContainer> | undefined,
	workflow?: Workflow | undefined,
): GraphManager {
	return new GraphManager(inputs, workflow ?? new Workflow())
}

function hasDefinedInputs(step: Step): boolean {
	return Object.keys(step.input).length > 0
}

function hasPossibleInputs(node: Node<unknown>) {
	return node.inputs.length > 0
}
