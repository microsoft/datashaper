/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	createSchemaValidator,
	NamedOutputPortBinding,
	NamedPortBinding,
	OutputPortBinding,
	WorkflowSchema,
} from '@datashaper/schema'
import {
	createWorkflowSchemaObject,
	LATEST_WORKFLOW_SCHEMA,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject, map, of } from 'rxjs'

import { DefaultGraph } from '../../dataflow/DefaultGraph.js'
import { observableNode } from '../../dataflow/index.js'
import type { Node, SocketName } from '../../dataflow/types.js'
import type { Maybe } from '../../primitives.js'
import { fetchJson } from '../../util/network.js'
import { Resource } from '../Resource.js'
import type { SchemaResource } from '../types.js'
import type { Step, StepInput, TableExportOptions } from './Workflow.types.js'
import { createNode, readStep } from './Workflow.utils.js'

const DEFAULT_INPUT = '__DEFAULT_INPUT__'

/**
 * The workflow object manages mutable data for a workflow specification
 */
export type TableObservable = Observable<Maybe<TableContainer>>
type TableSubject = BehaviorSubject<Maybe<TableContainer>>

export class Workflow
	extends Resource
	implements SchemaResource<WorkflowSchema>
{
	private static readonly validator = createSchemaValidator()
	public readonly $schema = LATEST_WORKFLOW_SCHEMA
	// Workflow Data Fields
	private readonly _steps = new BehaviorSubject<Step[]>([])
	private readonly _inputNames = new BehaviorSubject<string[]>([])
	private readonly _outputPorts = new BehaviorSubject<NamedOutputPortBinding[]>(
		[],
	)

	// The dataflow graph
	private readonly _graph = new DefaultGraph<TableContainer>()

	//
	// Output tracking - observables, data cache, subscriptions
	//
	private readonly _tableSubscriptions: Map<string, Subscription> = new Map()
	private readonly _tables = new Map<string, TableSubject>()
	private _defaultOutputSubscription: Subscription | undefined
	private readonly _defaultOutput = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private _defaultInputSubscription: Subscription | undefined
	private readonly _defaultInput = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private _disposables: Array<() => void> = []

	public constructor(input?: WorkflowSchema, private _strictInputs = false) {
		super()
		this.loadSchema(input, true)
		this._graph.add(observableNode(DEFAULT_INPUT, this._defaultInput))
	}

	public dispose(): void {
		this._defaultInputSubscription?.unsubscribe()
		this._defaultInputSubscription = undefined
		this._defaultOutputSubscription?.unsubscribe()
		this._defaultOutputSubscription = undefined
		this._tableSubscriptions.forEach(s => s.unsubscribe())
		this._tableSubscriptions.clear()
		this._graph.clear()
		this._disposables.forEach(d => d())
	}

	private rebindDefaultOutput() {
		const defaultOutputObservable = (): Maybe<
			Observable<Maybe<TableContainer>>
		> => {
			const steps = this.steps
			// Returns the default output of the final node
			if (steps.length === 0) return this._defaultInput
			const lastStepId = steps[steps.length - 1]!.id
			const lastNode = this.getNode(lastStepId)
			// Nodes use BehaviorSubject internally
			return lastNode.output$ as Observable<Maybe<TableContainer>>
		}
		this._defaultOutputSubscription?.unsubscribe()
		this._defaultOutputSubscription = defaultOutputObservable()?.subscribe(
			value => this._defaultOutput.next({ ...value, id: this.name }),
		)
	}

	// #region Graph/Node Management
	private addWorkflowStepToGraph(step: Step): void {
		const node = createNode(step)
		this._graph.add(node)
		this.configureStep(step, node)
	}

	/**
	 * Observe an output name
	 * @param name - The output to observe. If falsy, this will observe the default output of the final step.
	 * If no observable is ready yet, a new observable will be created
	 */
	public read(name?: string): Maybe<TableContainer> {
		return this._read(name).value
	}

	/**
	 * Observe an output name
	 * @param name - The output to observe. If falsy, this will observe the default output of the final step.
	 * If no observable is ready yet, a new observable will be created
	 */
	public read$(name?: string): Observable<Maybe<TableContainer>> {
		return this._read(name)
	}

	private _read(name?: string) {
		if (name == null) {
			return this._defaultOutput
		}
		if (!this._tables.has(name)) {
			this._tables.set(
				name,
				new BehaviorSubject<Maybe<TableContainer>>(undefined),
			)
		}
		return this._tables.get(name)!
	}

	private getNode(id: string): Node<TableContainer> {
		const graph = this._graph
		// bind to an input defined in the graph
		if (graph.hasNode(id)) {
			return graph.node(id)
		} else if (this.hasInputName(id)) {
			const result = observableNode(id, this.read$(id))
			graph.add(result)
			return result
		} else {
			throw new Error(`unknown node id or declared input: "${id}"`)
		}
	}
	// #endregion

	// #region Inputs
	public get inputNames(): string[] {
		return this._inputNames.value
	}

	public get inputNames$(): Observable<string[]> {
		return this._inputNames
	}

	public addInputName(input: string): void {
		if (!this.hasInputName(input)) {
			this._inputNames.next([...this.inputNames, input])
			this._onChange.next()
		}
	}

	public removeInputName(input: string): void {
		if (!this.hasInputName(input)) {
			this._inputNames.next([...this.inputNames].filter(i => i !== input))
			this._onChange.next()
		}
	}

	public hasInputName(input: string): boolean {
		return this.inputNames.some(i => i === input)
	}

	public set defaultInput(source: TableObservable) {
		this._defaultInputSubscription?.unsubscribe()
		this._defaultInputSubscription = source.subscribe(value =>
			this._defaultInput.next(value),
		)
		this.configureAllSteps()
		this._onChange.next()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInput(source: TableObservable, id: string): void {
		this._assertInputName(id)
		this._bindInputObservable(id, source)

		this.configureAllSteps()
		this._onChange.next()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInputs(values: Map<string, TableObservable>): void {
		for (const id of values.keys()) {
			this._assertInputName(id)
		}

		for (const [id, source] of values.entries()) {
			this._bindInputObservable(id, source)
		}

		this.configureAllSteps()
		this._onChange.next()
	}

	public removeInputObservable(id: string): void {
		this._removeInputObservableSilent(id)
		this._onChange.next()
	}

	private _removeInputObservableSilent(id: string): void {
		this._graph.remove(id)
		this._tableSubscriptions.get(id)?.unsubscribe()
		this._tableSubscriptions.delete(id)
		this._tables.delete(id)
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 * @param id - the input name to bind this table to (default will be the table id)
	 */
	public addInputTable(table: TableContainer, id: string): void {
		this.addInput(of(table), id)
	}

	public addInputTables(inputs: TableContainer[]): void {
		const map = new Map<string, Observable<Maybe<TableContainer>>>()
		inputs.forEach(i => map.set(i.id, of(i)))
		this.addInputs(map)
	}

	private _bindInputObservable(id: string, source: TableObservable): void {
		this._removeInputObservableSilent(id)
		const subject = new BehaviorSubject<Maybe<TableContainer>>(undefined)
		const subscription = source.subscribe(s => subject.next(s))
		this._tables.set(id, subject)
		this._tableSubscriptions.set(id, subscription)
		this._graph.add(observableNode(id, subject))
	}

	private _assertInputName(id: string | undefined): void {
		// if id is undefined, we're binding the default input
		if (id !== undefined && !this.hasInputName(id)) {
			if (this._strictInputs) {
				throw new Error(`input name ${id} not declared`)
			} else {
				this.addInputName(id)
			}
		}
	}

	// #endregion

	// #region Outputs
	public hasOutputName(name: string): boolean {
		return this.outputNames.some(i => i === name)
	}

	public suggestOutputName(name: string): string {
		const originalName = name.replace(/( \(\d+\))/, '')
		let derivedName = originalName
		let count = 1

		while (this.hasOutputName(derivedName)) {
			derivedName = `${originalName} (${count})`
			count++
		}
		return derivedName
	}

	public get outputPorts(): NamedOutputPortBinding[] {
		return this._outputPorts.value
	}

	public get outputPorts$(): Observable<NamedOutputPortBinding[]> {
		return this._outputPorts
	}

	/**
	 * Gets the output table names
	 */
	public get outputNames(): string[] {
		return this.outputPorts.map(p => p.name)
	}

	/**
	 * Gets the output table names
	 */
	public get outputNames$(): Observable<string[]> {
		return this._outputPorts.pipe(map(ports => ports.map(p => p.name)))
	}

	/**
	 * Add an output binding
	 * @param binding - The output binding
	 */
	public addOutput(output: NamedOutputPortBinding): void {
		if (this.hasOutputName(output.name) || this.hasInputName(output.name)) {
			throw new Error('new output name must be unique among outputs & inputs')
		}
		this._outputPorts.next([...this._outputPorts.value, output])
		this.observeOutput(output)
		this._onChange.next()
	}

	/**
	 * Remove an output binding
	 * @param name - the output name to remove
	 */
	public removeOutput(name: string): void {
		this._outputPorts.next(this.outputPorts.filter(t => t.name !== name))
		this._tables.delete(name)
		this._onChange.next()
	}

	public nodeOutput(nodeId: string): Maybe<Observable<Maybe<TableContainer>>> {
		const output = this.outputNameForNode(nodeId)
		if (output) {
			return this.read$(output)
		}
	}

	public outputNameForNode(nodeId: string): string | undefined {
		return this.outputPorts.find(def => def.node === nodeId)?.name
	}

	// #endregion

	// #region Steps
	public get steps(): Step[] {
		return this._steps.value
	}

	public get steps$(): BehaviorSubject<Step[]> {
		return this._steps
	}

	public get length(): number {
		return this._steps.value.length
	}

	public get length$(): Observable<number> {
		return this._steps.pipe(map(steps => steps.length))
	}

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	public addStep(stepInput: StepInput): Step {
		const steps = this.steps
		const newStep = readStep(
			stepInput,
			steps.length > 0 ? steps[steps.length - 1] : undefined,
		)
		// mutate the steps so that equality checks will detect that the steps changed (e.g. memo, hook deps)
		this._steps.next([...steps, newStep])
		this.addWorkflowStepToGraph(newStep)

		// Use this new step's output as the default output for the workflow
		this.rebindDefaultOutput()

		this._onChange.next()
		return newStep
	}

	public removeStep(index: number): void {
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

		// Remove step outputs from the configuration
		const stepOutputs = this.outputPorts.filter(o => o.node === node.id)
		stepOutputs.forEach(o => this.removeOutput(o.node))

		// Remove the step from the graph
		this._graph.remove(step.id)

		this._steps.next([...steps.slice(0, index), ...steps.slice(index + 1)])
		this.rebindDefaultOutput()
		this._onChange.next()
	}

	public updateStep(stepInput: StepInput, index: number): Step {
		const steps = this.steps
		const prevVersion = steps[index]!
		const step = readStep(stepInput, steps[index - 1])
		const node = this.getNode(step.id)
		this._steps.next([
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

		this.configureStep(step, node)

		this._onChange.next()
		return step
	}

	private configureAllSteps() {
		// bind the processing steps to the new input observables
		// TODO: input observable wiring should probably be managed in the DefaultGraph
		for (const step of this.steps) {
			this.configureStep(step, this._graph.node(step.id))
		}
	}

	private configureStep(step: Step, node: Node<TableContainer>) {
		node.config = step.args
		const stepIdx = this.steps.indexOf(step)
		const bindDefinedInputs = () => {
			for (const [input, binding] of Object.entries(step.input)) {
				// Bind variadic input
				if (isVariadic(input, binding)) {
					node.bind(binding.map(b => ({ node: this.getNode(b.node) })))
				} else if (this._graph.hasNode(binding.node)) {
					// Bind the named input
					node.bind({ input, node: this.getNode(binding.node) })
				}
			}
		}
		const bindDefaultInput = () => {
			node.bind({ node: this._graph.node(DEFAULT_INPUT) })
		}

		const bindPreviousStepOutput = () => {
			const prevStep = this.steps[stepIdx - 1]!
			node.bind({ node: this.getNode(prevStep.id) })
		}

		const isVariadic = (
			input: SocketName,
			_binding: NamedPortBinding | NamedPortBinding[],
		): _binding is NamedPortBinding[] => input === 'others'

		// if any inputs nodes are in the graph, bind them
		if (hasDefinedInputs(step)) {
			bindDefinedInputs()
		} else if (stepIdx === 0) {
			bindDefaultInput()
		} else if (stepIdx > 0) {
			bindPreviousStepOutput()
		} else {
			throw new Error(`cannot bind step input: idx=${stepIdx}`)
		}
	}

	// #endregion

	/**
	 * Gets a map of the current output tables
	 * @returns The output cache
	 */
	public toMap({
		includeDefaultInput,
		includeDefaultOutput,
		includeInputs,
	}: TableExportOptions = {}): Map<string, Maybe<TableContainer>> {
		const result = new Map<string, Maybe<TableContainer>>()

		if (includeDefaultOutput) {
			result.set('default', this._defaultOutput.value)
		}
		if (includeDefaultInput) {
			result.set('defaultInput', this._defaultInput.value)
		}
		for (const [name, observable] of this._tables) {
			if (!this.inputNames.includes(name) || includeInputs) {
				result.set(name, observable.value)
			}
		}
		return result
	}

	public toArray({
		includeDefaultInput,
		includeDefaultOutput,
		includeInputs,
	}: TableExportOptions = {}): Maybe<TableContainer>[] {
		const result: Maybe<TableContainer>[] = []
		if (includeDefaultOutput) {
			result.push(this._defaultOutput.value)
		}
		for (const [name, observable] of this._tables) {
			if (!this.inputNames.includes(name) || includeInputs) {
				result.push(observable.value)
			}
		}
		if (includeDefaultInput) {
			result.push(this._defaultInput.value)
		}
		return result
	}

	public override toSchema(): WorkflowSchema {
		return createWorkflowSchemaObject({
			...super.toSchema(),
			input: [...this.inputNames],
			output: [...this.outputPorts],
			steps: [...this.steps] as any,
		})
	}

	public override loadSchema(
		schema: Maybe<WorkflowSchema>,
		quiet?: boolean,
	): void {
		const readWorkflowInput = () => {
			let prev: Step | undefined
			const newSteps = schema?.steps?.map(i => {
				const step = readStep(i as StepInput, prev)
				prev = step
				return step
			})
			this._steps.next(newSteps ?? [])
			this._inputNames.next(unique(schema?.input ?? []))
			this._outputPorts.next(schema?.output?.map(resolveOutput) ?? [])
		}

		const syncWorkflowStateIntoGraph = () => {
			this._graph.clear()
			this._graph.add(observableNode(DEFAULT_INPUT, this._defaultInput))
			for (const step of this.steps) {
				this.addWorkflowStepToGraph(step)
			}
			for (const port of this.outputPorts.values()) {
				this.observeOutput(port)
			}
		}

		super.loadSchema(schema, true)
		readWorkflowInput()
		syncWorkflowStateIntoGraph()
		this.rebindDefaultOutput()
		if (!quiet) {
			this._onChange.next()
		}
	}

	private observeOutput({ name, node: nodeId }: NamedOutputPortBinding) {
		const lazyCreateOutputTable = () => {
			if (!this._tables.has(name)) {
				this._tables.set(
					name,
					new BehaviorSubject<Maybe<TableContainer>>(undefined),
				)
			}
			return this._tables.get(name) as BehaviorSubject<Maybe<TableContainer>>
		}

		const outputTable = lazyCreateOutputTable()
		const sub = this.getNode(nodeId).output$.subscribe(it =>
			outputTable.next(it && { ...it, id: name }),
		)
		this._disposables.push(() => sub.unsubscribe())
	}

	public static async validate(workflowJson: WorkflowSchema): Promise<boolean> {
		const { $schema } = workflowJson || {}
		if ($schema == null) {
			console.warn('No $schema property found in workflow JSON')
			return true
		}

		if (!Workflow.validator.schemas[$schema]) {
			const schemaJson = await fetchJson($schema)
			Workflow.validator.addSchema(schemaJson, $schema)
		}
		const validate = Workflow.validator.getSchema($schema)
		return !!validate?.(workflowJson)
	}
}

function resolveOutput(output: OutputPortBinding): NamedOutputPortBinding {
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

function unique<T>(arr: T[]): T[] {
	return [...new Set(arr).values()]
}
