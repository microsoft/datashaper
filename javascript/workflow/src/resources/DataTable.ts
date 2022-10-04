/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	DataTableSchema,
	WorkflowSchema,
} from '@datashaper/schema'
import { createDataTableSchemaObject, DataFormat } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { introspect, readTable } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import debug from 'debug'
import type { Observable, Subscription } from 'rxjs';
import { BehaviorSubject, EMPTY , map } from 'rxjs'

import { Codebook } from './Codebook.js'
import type { DataPackage } from './DataPackage.js'
import { DataShape } from './DataShape.js'
import { ParserOptions } from './ParserOptions.js'
import { Resource } from './Resource.js'
import type { SchemaResource } from './types.js'
import {
	isCodebook,
	isDataTable,
	isRawData,
	isWorkflow,
	resolveRawData,
	toResourceSchema,
} from './utils.js'
import { Workflow } from './Workflow.js'

const log = debug('datashaper')

export class DataTable
	extends Resource
	implements SchemaResource<DataTableSchema>
{
	private readonly _source = new BehaviorSubject<Maybe<ColumnTable>>(undefined)
	private readonly _inputs: Map<string, Observable<Maybe<TableContainer>>> =
		new Map()
	private readonly _output = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private _inputNames: string[] = []

	public readonly parser: ParserOptions = new ParserOptions()
	public readonly shape: DataShape = new DataShape()
	public readonly codebook: Codebook = new Codebook()
	public readonly workflow: Workflow = new Workflow()

	private _workflowExecutor: WorkflowExecutor = new WorkflowExecutor(
		this.id,
		this._source,
		this._inputs,
		this.workflow,
	)

	private _format: DataFormat = DataFormat.CSV
	private _rawData: Blob | undefined
	private _initPromise: Promise<void>

	public constructor(
		datatable?: DataTableSchema,
		resources?: Map<string, Blob>,
	) {
		super()
		this.parser.onChange(this.refreshSource)
		this.shape.onChange(this.refreshSource)
		this.workflow.onChange(() => this._onChange.next())

		// listen for workflow execution outputs
		this._workflowExecutor.output.subscribe(tbl => this._output.next(tbl))

		this._initPromise = this.loadSchema(datatable, resources)
	}

	public initialize(): Promise<void> {
		return this._initPromise
	}

	private refreshSource = (): void => {
		if (!this._rawData) {
			this._source.next(undefined)
		} else {
			readTable(this._rawData, this._format, this.parser)
				.then(table => this._source.next(withRowNumbers(table)))
				.catch(err => {
					log('error reading blob', err)
					throw err
				})
		}
		this._onChange.next()
	}

	// #region Class Fields
	public override get id(): string {
		return super.id
	}

	public override set id(id: string) {
		super.id = id
		this._workflowExecutor.id = id
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

	// #region Outputs
	public get source(): Observable<Maybe<ColumnTable>> {
		return this._source
	}

	public get currentSource(): Maybe<ColumnTable> {
		return this._source.value
	}

	public get output(): Observable<Maybe<TableContainer>> {
		return this._output
	}

	public get currentOutput(): Maybe<TableContainer> {
		return this._output.value
	}
	// #endregion

	public override toSchema(): DataTableSchema {
		return createDataTableSchemaObject({
			...super.toSchema(),
			format: this.format,
			shape: this.shape.toSchema(),
			parser: this.parser.toSchema(),
		})
	}

	public override async loadSchema(
		schema: DataTableSchema | null | undefined,
		files?: Map<string, Blob>,
		quiet?: boolean,
	): Promise<void> {
		await super.loadSchema(schema, files, true)
		this._inputs.clear()
		this._inputNames = []
		this._format = schema?.format ?? DataFormat.CSV
		// these loads will fire onChange events
		// which will trigger refreshSource
		this.parser.loadSchema(schema?.parser, files, true)
		this.shape.loadSchema(schema?.shape, files, true)

		if (files != null && schema?.sources != null) {
			for (const r of schema?.sources ?? []) {
				try {
					if (isRawData(r, files)) {
						this.data = await resolveRawData(r as string, files)
						continue
					}
					const res = await toResourceSchema(r, files)
					if (!res) {
						log('cannot resolve resource', r)
						continue
					}
					if (isDataTable(res)) {
						this._inputNames.push(res.name)
					} else if (isWorkflow(res)) {
						await this.workflow.loadSchema(res as WorkflowSchema, files)
					} else if (isCodebook(res)) {
						await this.codebook.loadSchema(res as CodebookSchema, files)
					} else {
						log('unknown resource type', res)
					}
				} catch (err) {
					log('error loading resource', err)
					throw err
				}
			}
		}

		if (!quiet) {
			this._onChange.next()
		}
	}

	public connect(store: DataPackage): void {
		const rebind = () => {
			this._inputs.clear()
			this._inputNames.forEach(name => {
				this._inputs.set(name, store.get(name)?.output ?? EMPTY)
			})
			this._workflowExecutor.wireWorkflowInput()
		}

		store.onChange(rebind)
	}
}

function withRowNumbers(table: ColumnTable): ColumnTable {
	return table.derive(
		{
			index: op.row_number(),
		},
		{ before: all() },
	)
}

class WorkflowExecutor {
	private _workflowSubscription?: Subscription
	private _outputTable: Maybe<ColumnTable>
	public readonly output = new BehaviorSubject<Maybe<TableContainer>>(undefined)

	constructor(
		private _id: string,
		private readonly source: BehaviorSubject<Maybe<ColumnTable>>,
		private readonly inputs: Map<string, Observable<Maybe<TableContainer>>>,
		private readonly workflow: Workflow,
	) {
		// When the source changes, re-wire it into the workflow's
		// input layer
		this.source.subscribe(table => {
			if (this.workflow.length > 0) {
				this.wireWorkflowInput()
			} else {
				this._outputTable = table
				this.emit()
			}
		})

		// When the workflow changes, re-bind the output-table observable
		this.workflow.onChange(() => {
			if (this._workflowSubscription != null)
				this._workflowSubscription.unsubscribe()

			if (this.workflow.length > 0) {
				this._workflowSubscription = this.workflow
					.outputObservable()
					?.subscribe(tbl => {
						this._outputTable = tbl?.table
						this.emit()
					})
			} else {
				this._outputTable = this.source.value
				this.emit()
			}
		})

		this.wireWorkflowInput()
	}

	private emit(): void {
		this.output.next({ id: this.id, table: this._outputTable })
	}

	public wireWorkflowInput() {
		if (this.source != null) {
			this.workflow.addInputObservable(
				this._id,
				this.source.pipe(
					map(table => {
						const metadata = table && introspect(table, true)
						return { id: this._id, table, metadata }
					}),
				),
			)
		}

		// Add peer-table inputs
		if (this.inputs.size > 0) {
			this.workflow.addInputObservables(this.inputs)
		}
	}

	public get id() {
		return this._id
	}
	public set id(id: string) {
		this._id = id
		this.wireWorkflowInput()
	}
}
