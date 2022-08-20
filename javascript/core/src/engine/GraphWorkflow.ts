/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type {
	NamedOutputPortBinding,
	NamedPortBinding,
} from '@datashaper/schema'
import type { Observable, Subscription } from 'rxjs'
import { from } from 'rxjs'

import type { Graph, Node } from '../dataflow/index.js'
import { DefaultGraph, observableNode } from '../dataflow/index.js'
import type { Maybe } from '../primitives.js'
import { createNode } from './createNode.js'
import type { Step, StepInput, WorkflowObject } from './types.js'
import { Workflow } from './Workflow.js'

// this could be used for (a) factory of step configs, (b) management of execution order
// (c) add/delete and correct reset of params, and so on

export type TableObservable = Observable<Maybe<TableContainer>>
/**
 * Manages a series of pipeline steps for interactive clients. This class specifically keeps a
 * workflow specification synchronized with a live processing graph and provides utility methods
 * for mutating the workflow.
 */
export class GraphWorkflow extends Workflow {
	// The dataflow graph
	public readonly graph: Graph<TableContainer> = new DefaultGraph()
	private _inputs: Map<string, TableContainer> = new Map()

	//
	// Output tracking - observables, data cache, subscriptions
	//
	private readonly outputObservables: Map<string, TableObservable> = new Map()
	private readonly outputCache: Map<string, Maybe<TableContainer>> = new Map()
	private readonly outputSubscriptions: Map<string, Subscription> = new Map()

	public constructor(workflowSpec?: WorkflowObject) {
		super(workflowSpec)
		for (const step of this.steps) {
			this._addWorkflowStepToGraph(step)
		}
		for (const value of this.outputs.values()) {
			this._bindGraphOutput(value)
		}
	}

	public get inputs(): Map<string, TableContainer> {
		return this._inputs
	}

	public set inputs(value: Map<string, TableContainer>) {
		this._inputs = value
		for (const i of this._inputs.keys()) {
			this._addInput(i)
		}
		this.fireOnChange()
	}

	public override hasOutput(name: string): boolean {
		return this.outputObservables.has(name)
	}

	public override clear() {
		super.clear()
		// TODO: clear graph
		this.outputObservables.clear()
		this.outputCache.clear()
		this.outputSubscriptions.clear()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInputTable(item: TableContainer): void {
		this._inputs.set(item.id, item)
		this._addInput(item.id)
		this.fireOnChange()
	}

	/**
	 * Removes a named input
	 * @param inputId - The input id to remove
	 */
	public override removeInput(inputName: string): void {
		this._inputs.delete(inputName)
		this._removeInput(inputName)
		this.fireOnChange()
	}

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	public override addStep(stepInput: StepInput): Step {
		const step = this._addStep(stepInput)
		this._addWorkflowStepToGraph(step)
		this.fireOnChange()
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
		const stepOutputs = this.outputDefinitions.filter(o => o.node === node.id)
		stepOutputs.forEach(o => this.removeOutput(o.name))

		// Remove the step from the graph
		this.graph.remove(step.id)

		// Remove the step from the workflow, fire onChange
		super.removeStep(index)
	}

	/**
	 * Reconfigure a step at an index
	 * @param index - The step index
	 * @param step - The step specification
	 */
	public override updateStep(
		stepInput: StepInput<unknown>,
		index: number,
	): Step {
		const prevVersion = this.stepAt(index)!
		const step = this._updateStep(stepInput, index)
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
		this.fireOnChange()
		return step
	}

	/**
	 * Add an output binding
	 * @param binding - The output binding
	 */
	public override addOutput(binding: NamedOutputPortBinding): void {
		this._addOutput(binding)
		this._bindGraphOutput(binding)
		this.fireOnChange()
	}

	/**
	 * Remove an output binding
	 * @param name - the output name to remove
	 */
	public override removeOutput(name: string): void {
		this._removeOutput(name)
		this.outputObservables.delete(name)
		this.outputSubscriptions.get(name)?.unsubscribe()
		this.outputSubscriptions.delete(name)
		this.outputCache.delete(name)
		this.fireOnChange()
	}

	private _bindGraphOutput(binding: NamedOutputPortBinding) {
		const { name, output, node } = binding

		// Register the output in the table store
		const port = this.getNode(node).output(output)
		this.outputObservables.set(name, port)
		const subscription = port.subscribe(latest => {
			this.outputCache.set(name, { ...latest, id: name })
			this.fireOnChange()
		})
		this.outputSubscriptions.set(name, subscription)
	}

	/**
	 * Log out the steps
	 */
	public print(): void {
		console.log(this.steps)
	}

	/**
	 * Gets the output table names
	 */
	public get outputNames(): string[] {
		return [...this.outputObservables.keys()]
	}

	public get outputDefinitions(): NamedOutputPortBinding[] {
		return [...this.outputs.values()]
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
	 * Gets a map of the current output tables
	 * @returns The output cache
	 */
	public toMap(): Map<string, Maybe<TableContainer>> {
		return this.outputCache
	}

	public toList(): Maybe<TableContainer>[] {
		return this.outputNames.map(o => this.latest(o))
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
					node.bind({ input, node: this.getNode(b.node), output: b.output })
				}
			}
		} else if (this.steps.length > 0 && node.inputs.length > 0) {
			// If no named input is present, try to auto-bind to the previous node
			const prevStep = this.steps[this.steps.length - 1]!
			node.bind({ node: this.getNode(prevStep.id) })
		}
	}

	private getNode(id: string): Node<TableContainer> {
		const graph = this.graph
		// bind to an input defined in the graph
		if (graph.hasNode(id)) {
			return graph.node(id)
		} else if (this.hasInput(id)) {
			// bind to a declared input
			return observableNode(id, from([this._inputs.get(id)]))
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
