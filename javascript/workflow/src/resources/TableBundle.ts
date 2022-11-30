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
import { applyCodebook, introspect } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { Observable } from 'rxjs'
import { BehaviorSubject, EMPTY, map } from 'rxjs'

import type { Codebook } from './Codebook.js'
import type { DataPackage } from './DataPackage/DataPackage.js'
import type { DataTable } from './DataTable.js'
import { Resource } from './Resource.js'
import type { Workflow } from './Workflow/Workflow.js'

export class TableBundle extends Resource {
	public readonly $schema = LATEST_TABLEBUNDLE_SCHEMA
	public readonly profile = KnownProfile.TableBundle
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

	public constructor(data?: TableBundleSchema) {
		super()
		this.loadSchema(data)
		this.rebindWorkflowInput()
	}

	public override get sources(): Resource[] {
		const result: Resource[] = []
		if (this.input != null) {
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

	public get input(): DataTable | undefined {
		return this._datatable
	}

	public set input(datatable: DataTable | undefined) {
		this._dtDisposables.forEach(d => d())
		this._dtDisposables = []

		this._datatable = datatable
		this.rebindWorkflowInput()

		if (datatable != null) {
			const sub = datatable.output$.subscribe(tbl => {
				const table = this.encode(tbl)
				// wire up latest input
				this._source.next(table)

				// if no workflow, pipe to output
				if (this.workflow == null) {
					this._output.next({ id: this.name, table })
				}
			})
			this._dtDisposables.push(() => sub.unsubscribe())

			datatable.onDispose(() => (this.input = undefined))
		} else {
			this._source.next(undefined)
			if (this.workflow == null) {
				this._output.next({ id: this.name, table: undefined })
			}
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
			codebook.onDispose(() => (this.codebook = undefined))
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

			workflow.onDispose(() => (this.workflow = undefined))
		}

		this.rebindWorkflowInput()
		this._onChange.next()
	}

	public override dispose(): void {
		this._wfDisposables.forEach(d => d())
		this.workflow?.dispose()
		super.dispose()
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
			if (this.input != null) {
				this.workflow.defaultInput$ = this.input.output$.pipe(
					map(table => {
						return {
							table: this.encode(table),
							id: this.name,
							// TODO: let parsing layer deal with this
							metadata: table && introspect(table, true),
						}
					}),
				)
			}

			/**
			 * Add other named inputs from the tablestore
			 */
			this.workflow.addInputs(this._inputs)
		}
	}

	private encode(inputTable: Maybe<ColumnTable>) {
		return this.codebook != null &&
			this.codebook.fields.length > 0 &&
			inputTable != null
			? applyCodebook(inputTable, this.codebook, CodebookStrategy.MappingOnly)
			: inputTable
	}
}
