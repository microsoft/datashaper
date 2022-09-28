/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema } from '@datashaper/schema'
import { createDataTableSchemaObject, DataFormat } from '@datashaper/schema'
import type { Maybe } from '@datashaper/workflow'
import { all, fromCSV, fromJSON, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import { DataShape } from './DataShape.js'
import { ParserOptions } from './ParserOptions.js'
import { Resource } from './Resource.js'
import type { SchemaResource } from './types.js'

export class DataSource
	extends Resource
	implements SchemaResource<DataTableSchema>
{
	private readonly _output = new BehaviorSubject<Maybe<ColumnTable>>(undefined)
	public readonly parser: ParserOptions = new ParserOptions()
	public readonly shape: DataShape = new DataShape()
	private _format: DataFormat = DataFormat.CSV
	private _source: Blob

	public constructor(source: Blob, datatable?: DataTableSchema) {
		super()
		this._source = source
		const handleSubItemChange = () => {
			this._refreshData()
			this._onChange.next()
		}
		this.parser.onChange(handleSubItemChange)
		this.shape.onChange(handleSubItemChange)

		this.loadSchema(datatable)
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

	public set data(value: Blob) {
		this._source = value
		this._refreshData()
		this._onChange.next()
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

	public override toSchema(): DataTableSchema {
		return createDataTableSchemaObject({
			...super.toSchema(),
			format: this.format,
			shape: this.shape.toSchema(),
			parser: this.parser.toSchema(),
		})
	}

	public override loadSchema(schema: DataTableSchema | null | undefined): void {
		super.loadSchema(schema)
		this.format = schema?.format ?? DataFormat.CSV
		this.parser.loadSchema(schema?.parser)
		this.shape.loadSchema(schema?.shape)
		this._refreshData()
		this._onChange.next()
	}
}
