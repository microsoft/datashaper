/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema, TableBundleSchema } from '@datashaper/schema'
import {
	CodebookStrategy,
	KnownProfile,
	LATEST_TABLEBUNDLE_SCHEMA,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { applyCodebook, generateCodebook } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import type { Observable } from 'rxjs'
import { BehaviorSubject, EMPTY, map } from 'rxjs'

import type { Codebook } from './Codebook.js'
import type { DataPackage } from './DataPackage/DataPackage.js'
import { Disposable } from './Disposable.js'
import { Resource } from './Resource.js'
import type { TableEmitter } from './types.js'
import type { Workflow } from './Workflow/Workflow.js'

export class TableBundle extends Resource implements TableEmitter {
	public readonly $schema = LATEST_TABLEBUNDLE_SCHEMA
	public readonly profile = KnownProfile.TableBundle

	public override defaultName(): string {
		return 'tablebundle.json'
	}

	private readonly _input$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private readonly _inputs = new Map<
		string,
		Observable<Maybe<TableContainer>>
	>()
	private readonly _output$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	private _input: TableEmitter | undefined
	private _codebook: Codebook | undefined
	private _workflow: Workflow | undefined

	/**
	 * These disposables are for tracking connections and event-bindings
	 */
	private _disposeOutputSub: Disposable | undefined
	private _disposeWorkflowConnections: Disposable | undefined
	private _disposeCodebookConnections: Disposable | undefined
	private _disposeInputConnections: Disposable | undefined

	public constructor(data?: TableBundleSchema) {
		super()
		this.loadSchema(data)
		this.bindDataflow()
	}

	public override get sources(): Resource[] {
		const result: Resource[] = []
		if (this.input != null && this.input.profile === KnownProfile.DataTable) {
			result.push(this.input)
		}
		if (this.codebook != null) {
			result.push(this.codebook)
		}
		if (this.workflow != null) {
			result.push(this.workflow)
		}
		return result
	}

	public override set sources(_value: Resource[]) {
		throw new Error('tablebundle sources are read-only')
	}

	public get input(): TableEmitter | undefined {
		return this._input
	}

	public set input(input: TableEmitter | undefined) {
		this.disposeInputConnections()
		this._input = input

		if (input != null) {
			this.populateCodebook()
			const d = new Disposable()
			d.onDispose(
				input.output$.pipe(map(this.encodeTable)).subscribe(this._input$),
			)
			d.onDispose(input.onDispose(() => (this.input = undefined)))
			this._disposeInputConnections = d
		}

		this.bindDataflow()
		this._onChange.next()
	}

	public get codebook(): Codebook | undefined {
		return this._codebook
	}

	public set codebook(codebook: Codebook | undefined) {
		this.disposeCodebookConnections()

		this._codebook = codebook

		if (codebook != null) {
			this.populateCodebook()
			const d = new Disposable()
			d.onDispose(codebook.onChange(this.bindDataflow))
			d.onDispose(codebook.onDispose(() => (this.codebook = undefined)))
			this._disposeCodebookConnections = d
		}

		this.bindDataflow()
		this._onChange.next()
	}

	public get workflow(): Workflow | undefined {
		return this._workflow
	}

	public set workflow(workflow: Workflow | undefined) {
		this.disposeWorkflowConnections()
		this._workflow = workflow

		if (workflow != null) {
			const d = new Disposable()
			d.onDispose(workflow.onChange(() => this._onChange.next()))
			d.onDispose(workflow.onDispose(() => (this.workflow = undefined)))
			this._disposeWorkflowConnections = d
		}

		this.bindDataflow()
		this._onChange.next()
	}

	public override dispose(): void {
		this.disposeInputConnections()
		this.disposeCodebookConnections()
		this.disposeWorkflowConnections()
		this.workflow?.dispose()
		this.codebook?.dispose()
		this.input?.dispose()
		this._input$.complete()
		this._output$.complete()
		super.dispose()
	}

	// #region Class Fields
	public override get name(): string {
		return super.name
	}

	public override set name(value: string) {
		super.name = value
		this.bindDataflow()
		this._onChange.next()
	}

	// #endregion

	public get output$(): Observable<Maybe<TableContainer>> {
		return this._output$
	}

	public get output(): Maybe<TableContainer> {
		return this._output$.value
	}

	public override toSchema(): ResourceSchema {
		return {
			...super.toSchema(),
			profile: this.profile,
		}
	}

	public override loadSchema(
		schema: Maybe<TableBundleSchema>,
		quiet?: boolean,
	): void {
		super.loadSchema(schema, true)
		this._inputs.clear()

		if (!quiet) {
			this._onChange.next()
		}
	}

	private disposeInputConnections() {
		this._disposeInputConnections?.dispose()
		this._disposeInputConnections = undefined
	}

	private disposeWorkflowConnections() {
		this._disposeWorkflowConnections?.dispose()
		this._disposeWorkflowConnections = undefined
	}

	private disposeCodebookConnections() {
		this._disposeCodebookConnections?.dispose()
		this._disposeCodebookConnections = undefined
	}

	public connect(dp: DataPackage): void {
		const rebindInputs = () => {
			this._inputs.clear()

			const tableNames = dp.resources
				.filter(r => r.profile === KnownProfile.TableBundle)
				.map(r => r.name)

			// Set the sibling table inputs
			tableNames.forEach(name =>
				this._inputs.set(
					name,
					(dp.getResource(name) as TableBundle)?.output$ ??
						(EMPTY as Observable<any>),
				),
			)
			// Set the input name from the source
			this._inputs.set(this.name, this._input$)
			this.bindDataflow()
		}

		dp.onChange(rebindInputs)
		rebindInputs()
	}

	private bindDataflow = () => {
		// by default, pipe the input to the output
		let out$: Observable<Maybe<TableContainer>> = this._input$

		// Setup workflow inputs, bind workflow to output
		if (this.workflow != null) {
			this.workflow.defaultInput$ = this._input$
			this.workflow.addInputs(this._inputs)
			out$ = this.workflow.read$()
		}

		// Establish the table-bundle output
		this._disposeOutputSub?.dispose()
		const d = new Disposable()
		d.onDispose(out$.pipe(map(this.renameTable)).subscribe(this._output$))
		this._disposeOutputSub = d
	}

	private encodeTable = (t: Maybe<TableContainer>): Maybe<TableContainer> => {
		const codebook = this.codebook
		if (t?.table == null || codebook == null || codebook.fields.length === 0) {
			return t
		}

		const encodedTable = applyCodebook(
			t.table,
			codebook!,
			CodebookStrategy.DataTypeAndMapping,
		)
		return { ...t, table: encodedTable }
	}

	private renameTable = (
		table: Maybe<TableContainer>,
	): Maybe<TableContainer> => {
		return table == null ? table : { ...table, id: this.name }
	}

	private populateCodebook() {
		if (this.codebook?.fields.length === 0 && this.input?.output?.table) {
			const name = this.codebook.name
			this.codebook.loadSchema(generateCodebook(this.input.output?.table))
			this.codebook.name = name
		}
	}
}
