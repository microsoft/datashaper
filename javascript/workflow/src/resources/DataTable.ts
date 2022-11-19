/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema } from '@datashaper/schema'
import {
	createDataTableSchemaObject,
	DataFormat,
	LATEST_DATATABLE_SCHEMA,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { introspect, readTable } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import debug from 'debug'
import type { Observable } from 'rxjs'
import { BehaviorSubject, EMPTY, map } from 'rxjs'

import { Codebook } from './Codebook.js'
import { DataShape } from './DataShape.js'
import { ParserOptions } from './ParserOptions.js'
import { Resource } from './Resource.js'
import type { TableStore } from './TableStore.js'
import type { SchemaResource } from './types.js'
import { Workflow } from './Workflow/Workflow.js'

const log = debug('datashaper')

export class DataTable
	extends Resource
	implements SchemaResource<DataTableSchema>
{
	public readonly $schema = LATEST_DATATABLE_SCHEMA
	public readonly profile = 'datatable'
	private readonly _source = new BehaviorSubject<Maybe<ColumnTable>>(undefined)
	private readonly _inputs = new Map<
		string,
		Observable<Maybe<TableContainer>>
	>()
	private readonly _output = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	public readonly parser = new ParserOptions()
	public readonly shape = new DataShape()
	public readonly codebook = new Codebook()
	public readonly workflow = new Workflow()

	private disposables: Array<() => void> = []

	private _format: DataFormat = DataFormat.CSV
	private _rawData: Blob | undefined

	public constructor(datatable?: DataTableSchema) {
		super()
		this.disposables.push(this.parser.onChange(this.refreshSource))
		this.disposables.push(this.shape.onChange(this.refreshSource))
		this.disposables.push(this.workflow.onChange(() => this._onChange.next()))

		const sub = this.workflow.read$()?.subscribe(tbl => this._output.next(tbl))
		this.disposables.push(() => sub?.unsubscribe())

		this.loadSchema(datatable)
		this.rebindWorkflowInput()
	}

	public dispose(): void {
		this.disposables.forEach(d => d())
		this.workflow.dispose()
	}

	private refreshSource = (): void => {
		if (!this._rawData) {
			this._source.next(undefined)
		} else {
			readTable(this._rawData, this)
				.then(t => this._source.next(t))
				.catch(err => {
					log('error reading blob', err)
					throw err
				})
		}
		this._onChange.next()
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

	public get data(): Blob | undefined {
		return this._rawData
	}

	public set data(value: Blob | undefined) {
		this._rawData = value
		this.refreshSource()
	}

	public get format(): DataFormat {
		return this._format
	}

	public set format(value: DataFormat) {
		this._format = value
		this.refreshSource()
	}
	// #endregion

	public get source$(): Observable<Maybe<ColumnTable>> {
		return this._source
	}

	public get source(): Maybe<ColumnTable> {
		return this._source.value
	}

	public get output$(): Observable<Maybe<TableContainer>> {
		return this._output
	}

	public get output(): Maybe<TableContainer> {
		return this._output.value
	}

	public override toSchema(): DataTableSchema {
		return createDataTableSchemaObject({
			...super.toSchema(),
			format: this.format,
			shape: this.shape.toSchema(),
			parser: this.parser.toSchema(),
		})
	}

	public override loadSchema(
		schema: Maybe<DataTableSchema>,
		quiet?: boolean,
	): void {
		super.loadSchema(schema, true)
		this._inputs.clear()
		this._format = schema?.format ?? DataFormat.CSV
		// these loads will fire onChange events
		// which will trigger refreshSource
		this.parser.loadSchema(schema?.parser, true)
		this.shape.loadSchema(schema?.shape, true)

		if (!quiet) {
			this._onChange.next()
		}
	}

	public connect(store: TableStore): void {
		const rebindInputs = () => {
			this._inputs.clear()
			// Set the sibling table inputs
			store.names.forEach(name =>
				this._inputs.set(
					name,
					store.get(name)?.output$ ?? (EMPTY as Observable<any>),
				),
			)
			// Set the input name from the source
			this._inputs.set(
				this.name,
				this._source.pipe(map(tbl => ({ id: this.name, table: tbl }))),
			)
			this.rebindWorkflowInput()
		}

		store.onChange(rebindInputs)
		rebindInputs()
	}

	private rebindWorkflowInput() {
		// Set the Default Input
		this.workflow.defaultInput$ = this.source$.pipe(
			map(table => ({
				table,
				id: this.name,
				// TODO: let parsing layer deal with this
				metadata: table && introspect(table, true),
			})),
		)
		this.workflow.addInputs(this._inputs)
	}
}
