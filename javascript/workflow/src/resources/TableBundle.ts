/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import { LATEST_DATABUNDLE_SCHEMA } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { Observable } from 'rxjs'
import { BehaviorSubject, EMPTY, map } from 'rxjs'

import type { Codebook } from './Codebook.js'
import type { DataPackage } from './DataPackage/DataPackage.js'
import type { DataTable } from './DataTable.js'
import { Resource } from './Resource.js'
import type { Workflow } from './Workflow/Workflow.js'

export class TableBundle extends Resource implements ResourceSchema {
	public readonly $schema = LATEST_DATABUNDLE_SCHEMA
	public readonly profile = 'tablebundle'
	public readonly defaultName = 'tablebundle.json'

	private readonly _source = new BehaviorSubject<Maybe<ColumnTable>>(undefined)
	private readonly _inputs = new Map<
		string,
		Observable<Maybe<TableContainer>>
	>()
	private readonly _output = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	private _datatable: DataTable | undefined
	private _codebook: Codebook | undefined
	private _workflow: Workflow | undefined

	private _wfDisposables: Array<() => void> = []
	private _cbDisposables: Array<() => void> = []
	private _dtDisposables: Array<() => void> = []

	public constructor(data?: Resource) {
		super()
		this.loadSchema(data)
		this.rebindWorkflowInput()
	}

	public get datatable(): DataTable | undefined {
		return this._datatable
	}

	public set datatable(datatable: DataTable | undefined) {
		this._dtDisposables.forEach(d => d())
		this._dtDisposables = []

		this._datatable = datatable
		this.rebindWorkflowInput()
		if (datatable != null) {
			const sub = datatable.output$.subscribe(tbl => {
				// wire up latest input
				this._source.next(tbl)

				// if no workflow, pipe to output
				if (this.workflow == null) {
					this._output.next({ id: this.name, table: tbl })
				}
			})
			this._dtDisposables.push(() => sub.unsubscribe())
		}
		this._onChange.next()
	}

	public get codebook(): Codebook | undefined {
		return this._codebook
	}

	public set codebook(codebook: Codebook | undefined) {
		this._cbDisposables.forEach(d => d())
		this._cbDisposables = []

		this._codebook = codebook

		if (codebook != null) {
			this._cbDisposables.push(
				codebook.onChange(() => this.rebindWorkflowInput()),
			)
		}

		this.rebindWorkflowInput()
		this._onChange.next()
	}

	public get workflow(): Workflow | undefined {
		return this._workflow
	}

	public set workflow(workflow: Workflow | undefined) {
		this._wfDisposables.forEach(d => d())
		this._wfDisposables = []

		this._workflow = workflow

		if (workflow != null) {
			this._wfDisposables.push(workflow.onChange(() => this._onChange.next()))
			const sub = workflow.read$()?.subscribe(tbl => this._output.next(tbl))
			this._wfDisposables.push(() => sub?.unsubscribe())
		}

		this.rebindWorkflowInput()
		this._onChange.next()
	}

	public dispose(): void {
		this._wfDisposables.forEach(d => d())
		this.workflow?.dispose()
	}

	// #region Class Fields
	public override get name(): string {
		return super.name
	}

	public override set name(value: string) {
		super.name = value
		this.rebindWorkflowInput()
		this._onChange.next()
	}

	// #endregion

	public get output$(): Observable<Maybe<TableContainer>> {
		return this._output
	}

	public get output(): Maybe<TableContainer> {
		return this._output.value
	}

	public override toSchema(): ResourceSchema {
		return {
			...super.toSchema(),
			profile: this.profile,
		}
	}

	public override loadSchema(schema: Maybe<Resource>, quiet?: boolean): void {
		super.loadSchema(schema, true)
		this._inputs.clear()

		if (!quiet) {
			this._onChange.next()
		}
	}

	public connect(dp: DataPackage): void {
		const rebindInputs = () => {
			this._inputs.clear()

			const tableNames = dp.resources
				.filter(r => r.profile === 'databundle')
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
			this._inputs.set(
				this.name,
				this._source.pipe(map(tbl => ({ id: this.name, table: tbl }))),
			)
			this.rebindWorkflowInput()
		}

		dp.onChange(rebindInputs)
		rebindInputs()
	}

	private rebindWorkflowInput() {
		/**
		 * Establish workflow inputs
		 */
		if (this.workflow != null) {
			/**
			 * Set the default input to the datatable output
			 */
			if (this.datatable != null) {
				this.workflow.defaultInput$ = this.datatable.output$.pipe(
					map(table => ({
						table,
						id: this.name,
						// TODO: let parsing layer deal with this
						metadata: table && introspect(table, true),
					})),
				)
			}

			/**
			 * Add other named inputs from the tablestore
			 */
			this.workflow.addInputs(this._inputs)
		}
	}
}
