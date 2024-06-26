import type { WorkflowSchema } from '@datashaper/schema'
import {
	KnownProfile,
	LATEST_WORKFLOW_SCHEMA,
	createWorkflowSchemaObject,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'
import type { BehaviorSubject, Observable } from 'rxjs'
import { EMPTY, map, of } from 'rxjs'

import { RemoveMode, TableManager } from '../../dataflow/TableManager.js'
import type { SocketName } from '../../dataflow/types.js'
import { isTableEmitter } from '../../predicates.js'
import type { Maybe, Unsubscribe } from '../../primitives.js'
import type { DataPackage } from '../DataPackage/DataPackage.js'
import { Resource } from '../Resource.js'
import type {
	Readable,
	TableEmitter,
	TableTransformer,
} from '../types/index.js'
import { GraphManager } from './GraphManager.js'
import { NameManager } from './NameManager.js'
import { WorkflowSchemaValidator } from './WorkflowSchemaValidator.js'
import type { Step, StepInput, TableExportOptions } from './types.js'
import { unique } from './utils.js'
const log = debug('datashaper:workflow')

/**
 * The workflow object manages mutable data for a workflow specification
 */
export type TableObservable = Observable<Maybe<TableContainer>>

export class Workflow extends Resource implements TableTransformer {
	public readonly $schema = LATEST_WORKFLOW_SCHEMA
	public readonly profile = KnownProfile.Workflow

	public override defaultTitle(): string {
		return 'workflow'
	}
	public override defaultName(): string {
		return 'workflow.json'
	}

	// Delegated Facade Managers
	private readonly _nameMgr = new NameManager()
	private readonly _tableMgr = new TableManager()
	private readonly _graphMgr = new GraphManager(this._tableMgr.defaultInput$)
	private _dataPackageSub?: Unsubscribe

	public constructor(
		input?: Readable<WorkflowSchema>,
		private _strictInputs = false,
	) {
		super()
		this.loadSchema(input, true)
		this.rebindDefaultOutput()
	}

	public override connect(dp: DataPackage, top: boolean): void {
		log('connecting')
		super.connect(dp, top)

		if (dp !== this.dataPackage || this._dataPackageSub == null) {
			this.dataPackage = dp
			this._dataPackageSub?.()
			const inputs = new Map<string, Observable<Maybe<TableContainer>>>()
			const rebindInputs = () => {
				inputs.clear()
				const values = dp.resources
					.filter(isTableEmitter)
					.map((r) => r.name)
					.reduce((prev, name: string) => {
						const emitter = dp.getResource(name) as TableEmitter
						prev.set(name, emitter?.output$ ?? EMPTY)
						return prev
					}, new Map<string, Observable<Maybe<TableContainer>>>())

				// Set the sibling table inputs
				log('bind workflow inputs', values)
				this.addInputs(values)
			}

			this._dataPackageSub = dp.onChange(rebindInputs)
			rebindInputs()
		}
	}

	/**
	 * Observe an output name
	 * @param name - The output to observe. If falsy, this will observe the default output of the final step.
	 * If no observable is ready yet, a new observable will be created
	 */
	public read(name?: string): Maybe<TableContainer> {
		const table = this._read(name).value
		const result = this.renameTo(name)(table)
		return result
	}

	/**
	 * Observe an output name
	 * @param name - The output to observe. If falsy, this will observe the default output of the final step.
	 * If no observable is ready yet, a new observable will be created
	 */
	public read$(name?: string): Observable<Maybe<TableContainer>> {
		return this._read(name).pipe(map(this.renameTo(name)))
	}

	private _read(name?: string): BehaviorSubject<Maybe<TableContainer>> {
		if (name == null) {
			return this._tableMgr.defaultOutput$
		}
		const [result, created] = this._tableMgr.ensure(name)
		if (created) {
			this.observeOutput(name)
		}
		return result
	}

	// #endregion

	// #region Inputs

	/**
	 * Get an observable of the names of all declared inputs and outputs.
	 * This does not include the default input or default output tables.
	 */
	public get tableNames$(): Observable<string[]> {
		return this._nameMgr.all$
	}

	/**
	 * Get the names of all declared inputs and outputs.
	 * This does not include the default input or default output tables.
	 */
	public get tableNames(): string[] {
		return unique(this.inputNames.concat(this.outputNames))
	}

	public get inputNames(): string[] {
		return this._nameMgr.inputs
	}

	public get inputNames$(): Observable<string[]> {
		return this._nameMgr.inputs$
	}

	public addInputName(input: string): void {
		if (!this._nameMgr.addInput(input)) {
			this._graphMgr.ensureInputNode(input)
			this._onChange.next()
		}
	}

	public removeInputName(name: string): void {
		if (!this._nameMgr.removeInput(name)) {
			this._graphMgr.removeInput(name)
			this._tableMgr.remove(name, RemoveMode.Hard)
			this._onChange.next()
		}
	}

	public hasInputName(input: string): boolean {
		return this._nameMgr.hasInput(input)
	}

	public get input$(): TableObservable {
		return this._tableMgr.defaultInput$
	}

	public set input$(source: Maybe<TableObservable>) {
		this._tableMgr.defaultInput$ = source ?? EMPTY
		this._graphMgr.configureAllSteps()
		this._onChange.next()
	}

	public get input(): Maybe<TableContainer> {
		return this._tableMgr.defaultInput$.value
	}

	public set input(source: Maybe<TableContainer>) {
		this._tableMgr.defaultInput = source
		this._graphMgr.configureAllSteps()
		this._onChange.next()
	}

	/**
	 * Add a named input
	 * @param input - the input table to add
	 */
	public addInput(source: TableObservable, id: string): void {
		this._assertInputName(id)
		this._graphMgr.ensureInputNode(id)
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
			this._graphMgr.ensureInputNode(id)
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
		this._tableMgr.remove(id, RemoveMode.Soft)
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
		for (const i of inputs) {
			map.set(i.id, of(i))
		}
		this.addInputs(map)
	}

	private _bindInputObservable(id: string, source: TableObservable): void {
		const d$ = this._tableMgr.bind(id, source)
		this._graphMgr.bind(id, d$)
	}

	private _assertInputName(id: string | undefined): void {
		this._nameMgr.assertInput(id, this._strictInputs)
	}

	// #endregion

	// #region Outputs

	/**
	 * Get the default output observable
	 */
	public get output$(): Observable<Maybe<TableContainer>> {
		return this.read$()
	}

	/**
	 * Get the current default output
	 */
	public get output(): Maybe<TableContainer> {
		return this.read()
	}

	public hasOutputName(name: string): boolean {
		return this._nameMgr.hasOutput(name)
	}

	public suggestOutputName(name: string): string {
		return this._nameMgr.suggestOutputName(name)
	}

	public get outputNames(): string[] {
		return this._nameMgr.outputs
	}

	public get outputNames$(): Observable<string[]> {
		return this._nameMgr.outputs$
	}

	/**
	 * Add an output binding
	 * @param binding - The output binding
	 */
	public addOutput(name: string): void {
		if (this.hasOutputName(name) || this.hasInputName(name)) {
			throw new Error('new output name must be unique among outputs & inputs')
		}
		this._nameMgr.addOutput(name)
		this.observeOutput(name)
		this._onChange.next()
	}

	/**
	 * Remove an output binding
	 * @param name - the output name to remove
	 */
	public removeOutput(name: string): void {
		if (this._nameMgr.removeOutput(name)) {
			this._tableMgr.remove(name, RemoveMode.Hard)
			this._onChange.next()
		}
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
	public addStep(input: StepInput): Step {
		log('add step', input)
		const newStep = this._graphMgr.addStep(input)
		// Use this new step's output as the default output for the workflow
		this.rebindDefaultOutput()
		this._onChange.next()
		return newStep
	}

	public removeStep(index: number): void {
		log(`remove step@${index}`)
		const node = this._graphMgr.removeStep(index)

		// Remove step outputs from the configuration
		const stepOutputs = this.outputNames.filter((o) => o === node.id)
		for (const o of stepOutputs) {
			this.removeOutput(o)
		}

		this.rebindDefaultOutput()
		this._onChange.next()
	}

	public updateStep(stepInput: StepInput, index: number): Step {
		log(`update step@${index}`)
		const step = this._graphMgr.updateStep(stepInput, index)
		this._onChange.next()
		return step
	}

	// #endregion

	// #region Schema Save, Load, and Validation

	public override toSchema(): WorkflowSchema {
		return createWorkflowSchemaObject({
			...super.toSchema(),
			input: [...this.inputNames],
			steps: [...this.steps] as any,
		})
	}

	public override loadSchema(
		schema: Maybe<Readable<WorkflowSchema>>,
		quiet?: boolean,
	): void {
		super.loadSchema(schema, true)
		const input = unique(schema?.input ?? [])

		this._nameMgr.setNames(input)
		for (const i of input) {
			this._graphMgr.ensureInputNode(i)
		}

		this._graphMgr.setSteps(schema?.steps?.map((i) => i as StepInput) ?? [])
		this.rebindDefaultOutput()
		if (!quiet) {
			this._onChange.next()
		}
	}

	public static async validate(workflowJson: WorkflowSchema): Promise<boolean> {
		return WorkflowSchemaValidator.validate(workflowJson)
	}

	// #endregion

	// #region Debugging Utilities

	public override dispose(): void {
		log('disposing')
		this._dataPackageSub?.()
		this._graphMgr.dispose()
		this._tableMgr.dispose()
		this._nameMgr.dispose()
		super.dispose()
	}

	public printStats(): void {
		this._graphMgr.printStats()
	}

	public toArray({
		includeDefaultInput,
		includeDefaultOutput,
		includeInputs,
	}: TableExportOptions = {}): Maybe<TableContainer>[] {
		return this._tableMgr.toArray(
			includeInputs
				? [...this.inputNames, ...this.outputNames]
				: this.outputNames,
			includeDefaultInput,
			includeDefaultOutput,
		)
	}

	// #endregion

	private rebindDefaultOutput() {
		const data$ = this._graphMgr.lastOutput$ ?? this._tableMgr.defaultInput$
		this._tableMgr.defaultOutput$ = data$
	}

	private observeOutput(
		nodeId: string,
		socketName: SocketName | undefined = undefined,
	) {
		const [outputTable] = this._tableMgr.ensure(nodeId)
		const n = this._graphMgr.getOrCreateNode(nodeId)
		outputTable.input = n.output$(socketName)
	}

	private renameTo =
		(name: string | undefined) =>
		(table: Maybe<TableContainer>): TableContainer => ({
			...(table ?? {}),
			id: name ?? this.name,
		})
}
