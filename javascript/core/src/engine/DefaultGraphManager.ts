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
import type {
	NamedOutputPortBinding,
	NamedPortBinding,
} from '../specification.js'
import type { Step, StepInput } from '../steps/index.js'
import { readStep } from '../steps/index.js'
import type { ParsedSpecification } from '../steps/types.js'
import { createNode } from './createNode.js'
import type { GraphManager } from './types.js'

// this could be used for (a) factory of step configs, (b) management of execution order
// (c) add/delete and correct reset of params, and so on

export type TableObservable = Observable<Maybe<TableContainer>>
/**
 * Manages a series of pipeline steps,
 * including creating default names, executing in order, etc.
 * This and the accompanying TableStore are very similar to Arquero's
 * notion of queries. Both are basically a chain pattern with context.
 * We deviate here in order to support some specific needs, such as:
 * - not wanting to be completely wedded to Arquero
 * - wanting async so we can lazy-load tables or invoke services
 * - building compound steps with recursive execution.
 * TODO: this could hide the TableStore for easier api use, and just provide proxy methods.
 */
export class DefaultGraphManager implements GraphManager {
	private readonly _graph: Graph<TableContainer> =
		new DefaultGraph<TableContainer>()
	private readonly _onChange = new Subject<void>()
	private readonly _spec: ParsedSpecification = {
		steps: [],
		input: new Set(),
		output: new Map(),
	}
	private readonly outputObservables: Map<string, TableObservable> = new Map()
	private readonly outputCache: Map<string, Maybe<TableContainer>> = new Map()
	private readonly outputSubscriptions: Map<string, Subscription> = new Map()

	public constructor(
		public readonly inputs: Map<string, TableContainer> = new Map(),
	) {}

	public get graph(): Graph<TableContainer> {
		return this._graph
	}
	public get spec(): ParsedSpecification {
		return this._spec
	}

	public clear(): void {
		for (let i = this._spec.steps.length - 1; i >= 0; --i) {
			this.removeStep(i)
		}
		this._spec.input.clear()
		this._spec.output.clear()
	}

	public addInput(input: string): void {
		this._spec.input.add(input)
		this._onChange.next()
	}

	public removeInput(input: string): void {
		this._spec.input.delete(input)
		this._onChange.next()
	}

	public addStep(stepInput: StepInput): Step {
		const step = readStep(stepInput)
		const node = createNode(step)
		this._spec.steps.push(step)
		this._graph.add(node)

		this._configureStep(step, node)

		this._onChange.next()

		return step
	}

	public removeStep(index: number): void {
		const step = this._spec.steps[index]!
		const prevStep = index > 0 ? this._spec.steps[index - 1] : undefined
		const nextStep =
			index + 1 < this._spec.steps.length
				? this._spec.steps[index + 1]
				: undefined
		const node = this.getNode(step.id)

		// If step was auto-bound
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

		// Remove the step from the graph
		this._graph.remove(step.id)
		this._onChange.next()
	}

	public reconfigureStep(index: number, stepInput: StepInput<unknown>): void {
		const prevVersion = this._spec.steps[index]!
		this._spec.steps[index] = readStep(stepInput)
		const step = this._spec.steps[index]!
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
	}

	/**
	 * Add an output binding
	 * @param name - The output name to register
	 * @param binding - The output binding
	 */
	public addOutput(name: string, binding: NamedOutputPortBinding): void {
		this._spec.output.set(name, binding)

		// Register the output in the table store
		const node = this.getNode(binding.node)
		const boundOutput = node.output(binding.output)
		this.outputObservables.set(name, boundOutput)
		const subscription = boundOutput.subscribe(latest => {
			this.outputCache.set(name, latest)
			this._onChange.next()
		})
		this.outputSubscriptions.set(name, subscription)

		this._onChange.next()
	}

	public removeOutput(name: string): void {
		this._spec.output.delete(name)
		this.outputObservables.delete(name)
		this.outputSubscriptions.get(name)?.unsubscribe()
		this.outputSubscriptions.delete(name)
		this.outputCache.delete(name)

		this._onChange.next()
	}

	public print(): void {
		console.log(this._spec.steps)
	}

	public get outputs(): string[] {
		return [...this.outputObservables.keys()]
	}

	public output(name: string): TableObservable {
		return this.outputObservables.get(name)!
	}

	public latest(name: string): Maybe<TableContainer> {
		return this.outputCache.get(name)
	}

	public toMap(): Map<string, Maybe<TableContainer>> {
		return this.outputCache
	}

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
		} else if (this._spec.steps.length > 0 && node.inputs.length > 0) {
			// If no named input is present, try to auto-bind to the previous node
			const prevStep = this._spec.steps[this._spec.steps.length - 1]!
			node.bind({ node: this.getNode(prevStep.id) })
		}
	}

	private getNode(id: string): Node<TableContainer> {
		const graph = this.graph
		// bind to an input defined in the graph
		if (graph.hasNode(id)) {
			return graph.node(id)
		} else if (this._spec.input.has(id)) {
			// bind to a declared input
			return observableNode(id, from([this.inputs.get(id)]))
		} else {
			throw new Error(`unknown node id or declared input: "${id}"`)
		}
	}
}

export function createGraphManager(
	inputs?: Map<string, TableContainer>,
): GraphManager {
	return new DefaultGraphManager(inputs)
}

function hasDefinedInputs(step: Step): boolean {
	return Object.keys(step.input).length > 0
}

function hasPossibleInputs(node: Node<unknown>) {
	return node.inputs.length > 0
}
