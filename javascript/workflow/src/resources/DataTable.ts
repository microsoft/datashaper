/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema } from '@datashaper/schema'
import {
	createDataTableSchemaObject,
	DataFormat,
	KnownProfile,
	LATEST_DATATABLE_SCHEMA,
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { readTable } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import debug from 'debug'
import { type Observable, BehaviorSubject } from 'rxjs'

import { DataShape } from './DataShape.js'
import { ParserOptions } from './ParserOptions.js'
import { Resource } from './Resource.js'
import type { Readable, TableEmitter } from './types.js'

const log = debug('datashaper')

export class DataTable extends Resource implements TableEmitter {
	public override defaultName(): string {
		return 'datatable.json'
	}
	public readonly $schema = LATEST_DATATABLE_SCHEMA
	public readonly profile = KnownProfile.DataTable
	private readonly _output$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	public readonly parser = new ParserOptions()
	public readonly shape = new DataShape()

	private _format = new BehaviorSubject<DataFormat>(DataFormat.CSV)

	private _rawData: Blob | undefined

	public constructor(datatable?: Readable<DataTableSchema>) {
		super()
		this.onDispose(this.parser.onChange(this.refreshData))
		this.onDispose(this.shape.onChange(this.refreshData))
		this.loadSchema(datatable)
	}

	private refreshData = (): void => {
		if (this._rawData != null) {
			readTable(this._rawData, this.toSchema(), { autoType: false })
				.then(t => this._output$.next({ table: t, id: this.name }))
				.catch(err => {
					log('error reading blob', err)
					throw err
				})
		} else {
			this._output$.next(undefined)
		}
		this._onChange.next()
	}

	// #region Class Fields
	public override get name(): string {
		return super.name
	}

	public override set name(value: string) {
		super.name = value
		this._onChange.next()
	}

	public get data(): Blob | undefined {
		return this._rawData
	}

	public set data(value: Blob | undefined) {
		this._rawData = value
		this.refreshData()
	}

	public get format$(): Observable<DataFormat> {
		return this._format
	}

	public get format(): DataFormat {
		return this._format.value
	}

	public set format(value: DataFormat) {
		this._format.next(value)
		this.refreshData()
	}
	// #endregion

	public get output$(): Observable<Maybe<TableContainer>> {
		return this._output$
	}

	public get output(): Maybe<TableContainer> {
		return this._output$.value
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
		schema: Maybe<Readable<DataTableSchema>>,
		quiet?: boolean,
	): void {
		super.loadSchema(schema, true)
		this._format.next(schema?.format ?? DataFormat.CSV)
		// these loads will fire onChange events
		// which will trigger refreshSource
		this.parser.loadSchema(schema?.parser, true)
		this.shape.loadSchema(schema?.shape, true)

		if (!quiet) {
			this._onChange.next()
		}
	}

	public override dispose(): void {
		this._output$.complete()
		super.dispose()
	}
}
