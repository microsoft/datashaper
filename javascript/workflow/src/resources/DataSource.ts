/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema } from '@datashaper/schema'
import { createDataTableSchemaObject, DataFormat } from '@datashaper/schema'
import { readTable } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import debug from 'debug'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'

import { DataShape } from './DataShape.js'
import { ParserOptions } from './ParserOptions.js'
import { Resource } from './Resource.js'
import type { SchemaResource } from './types.js'

const log = debug('datashaper')

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
		readTable(this._source, this._format, this.parser, this.shape)
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
				log('error reading blob', err)
				throw err
			})
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
