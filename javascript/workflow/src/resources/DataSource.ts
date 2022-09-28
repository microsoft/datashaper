/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	DataShape as DataShapeSchema,
	DataTableSchema,
	ParserOptions as ParserOptionsSchema,
} from '@datashaper/schema'
import { createDataTableSchemaObject, DataFormat } from '@datashaper/schema'
import type { Maybe, Unsubscribe } from '@datashaper/workflow'
import { all, fromCSV, fromJSON, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { Observable } from 'rxjs'
import { BehaviorSubject, Subject } from 'rxjs'

import { DataShape } from './DataShape.js'
import { ParserOptions } from './ParserOptions.js'
import type { ObservableResource, SchemaResource } from './types.js'

export class DataSource
	implements SchemaResource<DataTableSchema>, ObservableResource
{
	private readonly _onChange = new Subject<void>()
	private readonly _output = new BehaviorSubject<Maybe<ColumnTable>>(undefined)
	public readonly parser: ParserOptions
	public readonly shape: DataShape
	private _format: DataFormat
	private _source: Blob

	public constructor(
		source: Blob,
		format: DataFormat,
		shape?: DataShapeSchema,
		parserOptions?: ParserOptionsSchema,
	) {
		this._source = source
		this._format = format
		this.parser = new ParserOptions(parserOptions ?? {})
		this.shape = new DataShape(shape ?? {})

		const handleSubItemChange = () => {
			this._refreshData()
			this._onChange.next()
		}
		this.parser.onChange(handleSubItemChange)
		this.shape.onChange(handleSubItemChange)
		this._refreshData()
	}

	private _refreshData(): void {
		this._readBlob()
			.then(table =>
				this._output.next(
					// derive row numbers from the csvs
					table.derive(
						{
							index: op.row_number(),
						},
						{ before: all() },
					),
				),
			)
			.catch(err => {
				console.error('error reading blob', err)
				throw err
			})
	}

	private async _readBlob(): Promise<ColumnTable> {
		const format = this._format
		const parserOptions = this.parser
		// const layout = this._layout

		switch (format) {
			case DataFormat.JSON:
				return fromJSON(await this._source.text(), {})

			case DataFormat.CSV:
				return fromCSV(await this._source.text(), {
					delimiter: parserOptions?.delimiter,
					skip: parserOptions?.skipRows,
					// header: parserOptions?.header,
					// TODO: make user-configurable?
					autoMax: 10000,
				})
		}
	}

	public get data(): Blob {
		return this._source
	}

	public get currentOutput(): Maybe<ColumnTable> {
		let table: Maybe<ColumnTable> = undefined
		this.output?.subscribe(t => (table = t)).unsubscribe()
		return table
	}

	public get format(): DataFormat {
		return this._format
	}

	public set format(value: DataFormat) {
		this._format = value
		this._refreshData()
		this._onChange.next()
	}

	public get output(): Observable<Maybe<ColumnTable>> {
		return this._output
	}

	public toSchema(): DataTableSchema {
		return createDataTableSchemaObject({
			format: this.format,
			shape: this.shape.toSchema(),
			parser: this.parser.toSchema(),
		})
	}

	public loadSchema(schema: DataTableSchema | null | undefined): void {
		console.log('load schema', schema)
		this.format = schema?.format ?? DataFormat.CSV
		this.parser.loadSchema(schema?.parser)
		this.shape.loadSchema(schema?.shape)
		this._refreshData()
		this._onChange.next()
	}

	public onChange(cb: () => void): Unsubscribe {
		const sub = this._onChange.subscribe(cb)
		return () => sub.unsubscribe()
	}
}
