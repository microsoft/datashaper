/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { Observable } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'

import { DefaultGraph } from '../../dataflow/DefaultGraph.js'
import { observableNode } from '../../dataflow/index.js'
import type { Node } from '../../dataflow/types.js'
import type { Maybe } from '../../primitives.js'
import { Disposable } from '../Disposable.js'
import { createNode } from './createNode.js'
import { readStep } from './readStep.js'
import type { Step, StepInput } from './types.js'
import {
	hasDefinedInputs,
	hasPossibleInputs,
	isVariadicSocketName,
} from './utils.js'

const DEFAULT_INPUT = '__DEFAULT_INPUT__'

export class GraphManager extends Disposable {
	private readonly _graph = new DefaultGraph<TableContainer>()
	private readonly _defaultInputNode: Node<TableContainer>
	private readonly _steps$ = new BehaviorSubject<Step[]>([])
	private readonly _numSteps$ = this._steps$.pipe(map(steps => steps.length))

	public constructor(defaultInput$: Observable<Maybe<TableContainer>>) {
		super()
		this._defaultInputNode = observableNode(DEFAULT_INPUT, defaultInput$)
		this._graph.add(this._defaultInputNode)
	}

	public get steps(): Step[] {
		return this._steps$.value
	}

	public get steps$(): BehaviorSubject<Step[]> {
		return this._steps$
	}

	public get length(): number {
		return this._steps$.value.length
	}

	public get length$(): Observable<number> {
		return this._numSteps$
	}

	public setSteps(steps: StepInput[]): void {
		// Update the graph state
		this._graph.clear()
		this._graph.add(this._defaultInputNode)

		for (const step of steps) {
			this.addStep(step)
		}
	}

	public override dispose(): void {
		this._graph.clear()
		this._steps$.complete()
		super.dispose()
	}

	public getDefaultInput(): Node<TableContainer> {
		return this._defaultInputNode
	}

	public getNode(id: string): Node<TableContainer> {
		return this._graph.node(id)
	}

	public hasNode(id: string): boolean {
		return this._graph.hasNode(id)
	}

	public addStep(stepInput: StepInput): Step {
		const steps = this.steps
		const newStep = readStep(
			stepInput,
			steps.length > 0 ? steps[steps.length - 1] : undefined,
		)
		// mutate the steps so that equality checks will detect that the steps changed (e.g. memo, hook deps)
		const node = createNode(newStep)
		this._graph.add(node)
		this.configureStep(newStep, steps[steps.length - 1])

		// emit the new steps array
		this._steps$.next([...steps, newStep])
		return newStep
	}

	public removeStep(index: number): Node<TableContainer> {
		const steps = this.steps
		const step = steps[index]!
		const prevStep = index > 0 ? steps[index - 1] : undefined
		const nextStep = index + 1 < this.length ? steps[index + 1] : undefined
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

		// Remove the step from the graph
		this.removeNode(step.id)
		this._steps$.next([...steps.slice(0, index), ...steps.slice(index + 1)])

		return node
	}

	public updateStep(stepInput: StepInput, index: number): Step {
		const steps = this.steps
		const prevVersion = steps[index]!
		const step = readStep(stepInput, steps[index - 1])
		const node = this.getNode(step.id)
		this._steps$.next([
			...steps.slice(0, index),
			step,
			...steps.slice(index + 1),
		])

		// todo: handle rename. Add graph.rename(nodeId) method
		if (prevVersion.id !== step.id) {
			throw new Error('node rename not supported yet')
		}

		// todo: add node.clearBindings() to dataflow node
		for (const binding of node.bindings) {
			node.unbind(binding.input)
		}

		this.configureStep(step, (index > 0 && steps[index - 1]) || undefined)

		return step
	}

	public configureStep(step: Step, prevStep: Step | undefined): void {
		const node = this.getNode(step.id)
		node.config = step.args
		const bindDefinedInputs = () => {
			for (const [input, binding] of Object.entries(step.input)) {
				// Bind variadic input
				if (isVariadicSocketName(input, binding)) {
					node.bind(binding.map(b => ({ node: this.getNode(b.node) })))
				} else if (this.hasNode(binding.node)) {
					// Bind the named input
					node.bind({ input, node: this.getNode(binding.node) })
				}
			}
		}

		// if any inputs nodes are in the graph, bind them
		if (hasDefinedInputs(step)) {
			bindDefinedInputs()
		} else if (prevStep == null) {
			node.bind({ node: this.getDefaultInput() })
		} else if (prevStep != null) {
			node.bind({ node: this.getNode(prevStep.id) })
		} else {
			throw new Error(`cannot bind step input`)
		}
	}

	public getOrCreateNode(
		id: string,
		getSource: (id: string) => Observable<Maybe<TableContainer>> | undefined,
	): Node<TableContainer> {
		const g = this._graph
		if (g.hasNode(id)) {
			// try to find the named node in the graph
			return g.node(id)
		} else {
			// try to create a new node by locating the observable source
			const source = getSource(id)
			if (source != null) {
				return this.createNode(id, source)
			} else {
				throw new Error(`could not get or create node with id: "${id}"`)
			}
		}
	}

	public get lastOutput$(): Observable<Maybe<TableContainer>> | undefined {
		const steps = this.steps
		// Returns the default output of the final node
		if (steps.length === 0) {
			return undefined
		}
		const lastStepId = steps[steps.length - 1]!.id
		const lastNode = this.getNode(lastStepId)
		// Nodes use BehaviorSubject internally
		return lastNode.output$ as Observable<Maybe<TableContainer>>
	}

	public createNode(
		id: string,
		Observable: Observable<Maybe<TableContainer>>,
	): Node<TableContainer> {
		const node = observableNode(id, Observable)
		this._graph.add(node)
		return node
	}

	public removeNode(id: string): void {
		this._graph.remove(id)
	}

	public configureAllSteps(): void {
		let prevStep: Step | undefined
		for (const step of this.steps) {
			this.configureStep(step, prevStep)
			prevStep = step
		}
	}
}
