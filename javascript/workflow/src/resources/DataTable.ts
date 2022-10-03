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
import { introspect,readTable } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import debug from 'debug'
import type { Observable, Subscription } from 'rxjs';
import { BehaviorSubject,map  } from 'rxjs'

import { Codebook } from './Codebook.js'
import { DataShape } from './DataShape.js'
import { ParserOptions } from './ParserOptions.js'
import { Resource } from './Resource.js'
import type { SchemaResource } from './types.js'
import {
	isCodebook,
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
	private readonly _output = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	public readonly parser: ParserOptions = new ParserOptions()
	public readonly shape: DataShape = new DataShape()
	public readonly codebook: Codebook = new Codebook()
	public readonly workflow: Workflow = new Workflow()

	private _workflowExecutor: WorkflowExecutor = new WorkflowExecutor(
		this.id,
		this._source,
		this.workflow,
	)

	private _format: DataFormat = DataFormat.CSV
	private _rawData: Blob | undefined

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

		this.loadSchema(datatable, resources)
		this.setWorkflowInput()
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

	private setWorkflowInput() {
		this.workflow.addInputObservable(
			this.id,
			this._source.pipe(
				map(table => {
					const metadata = table && introspect(table, true)
					return { id: this.id, table, metadata }
				}),
			),
		)
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
		resources?: Map<string, Blob>,
		quiet?: boolean,
	): Promise<void> {
		await super.loadSchema(schema, resources, true)
		this.format = schema?.format ?? DataFormat.CSV
		// these loads will fire onChange events
		// which will trigger refreshSource
		this.parser.loadSchema(schema?.parser, resources, true)
		this.shape.loadSchema(schema?.shape, resources, true)

		if (resources != null && schema?.sources != null) {
			for (const res of schema?.sources ?? []) {
				if (isRawData(res)) {
					this.data = await resolveRawData(res as string, resources)
					continue
				}
				const resource = await toResourceSchema(res, resources)
				if (!resource) {
					log('cannot resolve resource', res)
					continue
				}
				if (isWorkflow(resource)) {
					await this.workflow.loadSchema(resource as WorkflowSchema, resources)
				} else if (isCodebook(resource)) {
					await this.codebook.loadSchema(resource as CodebookSchema, resources)
				} else {
					log('unknown resource type', resource)
				}
			}
		}

		if (!quiet) {
			this._onChange.next()
		}
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

	private wireWorkflowInput() {
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

	public get id() {
		return this._id
	}
	public set id(id: string) {
		this._id = id
		this.wireWorkflowInput()
	}
}
