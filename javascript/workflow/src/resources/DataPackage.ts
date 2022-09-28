/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type { DataPackageSchema } from '@datashaper/schema'
import { createDataPackageSchemaObject } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import { Workflow } from '@datashaper/workflow'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'

import { Codebook } from './Codebook.js'
import type { DataSource } from './DataSource.js'
import { Named } from './Named.js'
import type { SchemaResource } from './types.js'

export class DataPackage
	extends Named
	implements SchemaResource<DataPackageSchema>
{
	private readonly _output = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	private _codebook?: any
	private _outputSubscription?: Subscription

	public constructor(
		id: string,
		public readonly source: DataSource,
		public readonly workflow = new Workflow(),
		public readonly codebook = new Codebook(),
	) {
		super()
		this.id = id

		this.source.output.subscribe(table => {
			const tableContainer: TableContainer = { id, table }
			if (this.workflow.length > 0) {
				this._setGraphInput()
			} else {
				this._output.next(tableContainer)
			}
		})

		this.workflow.onChange(() => {
			if (this._outputSubscription != null)
				this._outputSubscription.unsubscribe()
			if (this.workflow.length > 0) {
				this._outputSubscription = this.workflow
					.outputObservable()
					?.subscribe(tbl => this._output.next(tbl))
			} else {
				this._output.next({ id: this.id, table: this.source.currentOutput })
			}
			this._onChange.next()
		})

		// Add the last table from the source to the graph
		this._setGraphInput()
		this._onChange.next()
	}

	public override set id(id: string) {
		super.id = id
		// emit a TableContainer with the new name
		this._output.next({ id, table: this.source.currentOutput })
		this._onChange.next()
	}

	public get output(): Observable<Maybe<TableContainer>> {
		return this._output
	}

	public get currentOutput(): Maybe<TableContainer> {
		let table: Maybe<TableContainer> = undefined
		this.output?.subscribe(t => (table = t)).unsubscribe()
		return table
	}

	private _setGraphInput() {
		this.workflow.addInputObservable(
			this.id,
			this.source.output.pipe(
				map(table => {
					const metadata = table && introspect(table, true)
					return { id: this.id, table, metadata }
				}),
			),
		)
	}

	public override toSchema(): DataPackageSchema {
		const datafile = `${this.id}.${this.source.format}`
		const resources: string[] = [datafile, 'datasource.json']
		if (this.workflow.length > 0) {
			resources.push('workflow.json')
		}
		if (this._codebook.fields.length > 0) {
			resources.push('codebook.json')
		}
		return createDataPackageSchemaObject({
			...super.toSchema(),
			resources,
		})
	}

	public override loadSchema(
		_schema: DataPackageSchema | null | undefined,
	): void {
		throw new Error('not implemented')
	}
}
