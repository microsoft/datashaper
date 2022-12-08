/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { WorkflowSchema } from '@datashaper/schema'
import {
	createWorkflowSchemaObject,
	KnownProfile,
	LATEST_WORKFLOW_SCHEMA,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject, map, mergeWith, of } from 'rxjs'

import type { Node } from '../../dataflow/types.js'
import type { Maybe } from '../../primitives.js'
import { DelegateSubject } from '../../util/rx.js'
import { Resource } from '../Resource.js'
import { GraphManager } from './GraphManager.js'
import type { Step, StepInput, TableExportOptions } from './types.js'
import { unique } from './utils.js'
import { WorkflowSchemaValidator } from './WorkflowSchemaValidator.js'

/**
 * The workflow object manages mutable data for a workflow specification
 */
export type TableObservable = Observable<Maybe<TableContainer>>
type TableSubject = BehaviorSubject<Maybe<TableContainer>>

export class Workflow extends Resource {
	public readonly $schema = LATEST_WORKFLOW_SCHEMA
	public readonly profile = KnownProfile.Workflow

	// Workflow Data Fields
	private readonly _inputNames$ = new BehaviorSubject<string[]>([])
	private readonly _outputNames$ = new BehaviorSubject<string[]>([])
	private readonly _allTableNames$ = this._outputNames$
		.pipe(mergeWith(this._inputNames$))
		.pipe(
			map(() =>
				unique(this._outputNames$.value.concat(this._inputNames$.value)),
			),
		)

	//
	// Output tracking - observables, data cache, subscriptions
	//
	private readonly _tableSubscriptions: Map<string, Subscription> = new Map()
	private readonly _tables = new Map<string, TableSubject>()
	private readonly _defaultOutput$ = new DelegateSubject<TableContainer>()
	private readonly _defaultInput$ = new DelegateSubject<TableContainer>()
	private _disposables: Array<() => void> = []

	// The dataflow graph
	private readonly _graphMgr = new GraphManager(this._defaultInput$)

	public override defaultName(): string {
		return 'workflow.json'
	}

	public constructor(input?: WorkflowSchema, private _strictInputs = false) {
		super()
		this.loadSchema(input, true)
	}

	public override dispose(): void {
		this._defaultInput$.dispose()
		this._defaultOutput$.dispose()
		this._tableSubscriptions.forEach(s => s.unsubscribe())
		this._tableSubscriptions.clear()
		this._graphMgr.dispose()
		this._disposables.forEach(d => d())
		this._inputNames$.complete()
		this._outputNames$.complete()
		for (const t of this._tables.values()) {
			t.complete()
		}

		super.dispose()
	}

	private rebindDefaultOutput() {
		const defaultOutputObservable = (): Maybe<
			Observable<Maybe<TableContainer>>
		> => {
			const steps = this.steps
			// Returns the default output of the final node
			if (steps.length === 0) {
				return this._defaultInput$
			}
			const lastStepId = steps[steps.length - 1]!.id
			const lastNode = this.getNode(lastStepId)
			// Nodes use BehaviorSubject internally
			return lastNode.output$ as Observable<Maybe<TableContainer>>
		}

		this._defaultOutput$.input = defaultOutputObservable()
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
			return this._defaultOutput$
		}
		const [result, created] = this._ensureTable(name)
		if (created) {
			this.observeOutput(name)
		}
		return result
	}

	private getNode(id: string): Node<TableContainer> {
		return this._graphMgr.getOrCreateNode(id, (id: string) => {
			if (this.hasInputName(id)) {
				return this.read$(id)
			}
		})
	}
	// #endregion

	// #region Inputs

	/**
	 * Get an observable of the names of all declared inputs and outputs.
	 * This does not include the default input or default output tables.
	 */
	public get allTableNames$(): Observable<string[]> {
		return this._allTableNames$
	}

	/**
	 * Get the names of all declared inputs and outputs.
	 * This does not include the default input or default output tables.
	 */
	public get allTableNames(): string[] {
		return unique(this.inputNames.concat(this.outputNames))
	}

	public get inputNames(): string[] {
		return this._inputNames$.value
	}

	public get inputNames$(): Observable<string[]> {
		return this._inputNames$
	}

	public addInputName(input: string): void {
		if (!this.hasInputName(input)) {
			this._inputNames$.next([...this.inputNames, input])
			this._onChange.next()
		}
	}

	public removeInputName(input: string): void {
		if (!this.hasInputName(input)) {
			this._inputNames$.next([...this.inputNames].filter(i => i !== input))
			this._onChange.next()
		}
	}

	public hasInputName(input: string): boolean {
		return this.inputNames.some(i => i === input)
	}

	public get defaultInput$(): TableObservable {
		return this._defaultInput$
	}

	public set defaultInput$(source: TableObservable) {
		this._defaultInput$.input = source
		this._graphMgr.configureAllSteps()
		this._onChange.next()
	}

	public get defaultInput(): Maybe<TableContainer> {
		return this._defaultInput$.value
	}

	public set defaultInput(source: Maybe<TableContainer>) {
		this._defaultInput$.next(source)
		this._graphMgr.configureAllSteps()
		this._onChange.next()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInput(source: TableObservable, id: string): void {
		this._assertInputName(id)
		this._bindInputObservable(id, source)

		this._graphMgr.configureAllSteps()
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

		this._graphMgr.configureAllSteps()
		this._onChange.next()
	}

	public removeInputObservable(id: string): void {
		this._removeInputObservableSilent(id)
		this._onChange.next()
	}

	private _removeInputObservableSilent(id: string): void {
		this._graphMgr.removeNode(id)
		this._tableSubscriptions.get(id)?.unsubscribe()
		this._tableSubscriptions.delete(id)
		// leave the client read subjects alone, but clear out the current value
		this._tables.get(id)?.next(undefined)
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
		const [subject] = this._ensureTable(id)
		const subscription = source.subscribe(s => subject.next(s))
		this._tables.set(id, subject)
		this._tableSubscriptions.set(id, subscription)
		this._graphMgr.createNode(id, subject)
	}

	private _ensureTable(
		id: string,
	): [BehaviorSubject<Maybe<TableContainer>>, boolean] {
		let created = false
		if (!this._tables.has(id)) {
			this._tables.set(
				id,
				new BehaviorSubject<Maybe<TableContainer>>(undefined),
			)
			created = true
		}
		return [this._tables.get(id)!, created]
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

	public get outputNames(): string[] {
		return this._outputNames$.value
	}

	public get outputNames$(): Observable<string[]> {
		return this._outputNames$
	}

	/**
	 * Add an output binding
	 * @param binding - The output binding
	 */
	public addOutput(name: string): void {
		if (this.hasOutputName(name) || this.hasInputName(name)) {
			throw new Error('new output name must be unique among outputs & inputs')
		}
		this._outputNames$.next([...this._outputNames$.value, name])
		this.observeOutput(name)
		this._onChange.next()
	}

	/**
	 * Remove an output binding
	 * @param name - the output name to remove
	 */
	public removeOutput(name: string): void {
		this._outputNames$.next(this.outputNames.filter(t => t !== name))
		this._tables.delete(name)
		this._onChange.next()
	}

	// #endregion

	// #region Steps
	public get steps(): Step[] {
		return this._graphMgr.steps
	}

	public get steps$(): BehaviorSubject<Step[]> {
		return this._graphMgr.steps$
	}

	public get length(): number {
		return this._graphMgr.length
	}

	public get length$(): Observable<number> {
		return this._graphMgr.length$
	}

	/**
	 * Adds a step to the pipeline
	 * @param step - the step to add
	 */
	public addStep(stepInput: StepInput): Step {
		const newStep = this._graphMgr.addStep(stepInput)
		// Use this new step's output as the default output for the workflow
		this.rebindDefaultOutput()
		this._onChange.next()
		return newStep
	}

	public removeStep(index: number): void {
		const node = this._graphMgr.removeStep(index)

		// Remove step outputs from the configuration
		const stepOutputs = this.outputNames.filter(o => o === node.id)
		stepOutputs.forEach(o => this.removeOutput(o))

		this.rebindDefaultOutput()
		this._onChange.next()
	}

	public updateStep(stepInput: StepInput, index: number): Step {
		const step = this._graphMgr.updateStep(stepInput, index)
		this._onChange.next()
		return step
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
		const addTable = (name: string) =>
			result.set(name, this._tables.get(name)!.value)

		if (includeDefaultOutput) {
			result.set('default', this._defaultOutput$.value)
		}
		if (includeDefaultInput) {
			result.set('defaultInput', this._defaultInput$.value)
		}
		if (includeInputs) {
			this.inputNames.forEach(addTable)
		}
		this.outputNames.forEach(addTable)
		return result
	}

	public toArray({
		includeDefaultInput,
		includeDefaultOutput,
		includeInputs,
	}: TableExportOptions = {}): Maybe<TableContainer>[] {
		const result: Maybe<TableContainer>[] = []
		const addTable = (name: string) =>
			result.push(this._tables.get(name)!.value)
		if (includeDefaultInput) {
			result.push(this._defaultInput$.value)
		}
		if (includeInputs) {
			this.inputNames.forEach(addTable)
		}
		this.outputNames.forEach(addTable)

		if (includeDefaultOutput) {
			result.push(this._defaultOutput$.value)
		}
		return result
	}

	public override toSchema(): WorkflowSchema {
		return createWorkflowSchemaObject({
			...super.toSchema(),
			input: [...this.inputNames],
			output: [...this.outputNames],
			steps: [...this.steps] as any,
		})
	}

	public override loadSchema(
		schema: Maybe<WorkflowSchema>,
		quiet?: boolean,
	): void {
		super.loadSchema(schema, true)
		this._graphMgr.setSteps(schema?.steps?.map(i => i as StepInput) ?? [])
		this._inputNames$.next(unique(schema?.input ?? []))
		this._outputNames$.next(schema?.output ?? [])
		this.rebindDefaultOutput()
		if (!quiet) {
			this._onChange.next()
		}
	}

	private observeOutput(name: string) {
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
		const sub = this.getNode(name).output$.subscribe(it =>
			outputTable.next(it && { ...it, id: name }),
		)
		this._disposables.push(() => sub.unsubscribe())
	}

	public static async validate(workflowJson: WorkflowSchema): Promise<boolean> {
		return WorkflowSchemaValidator.validate(workflowJson)
	}
}
