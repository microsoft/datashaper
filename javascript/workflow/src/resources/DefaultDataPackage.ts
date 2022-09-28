/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type {
	DataPackageSchema} from '@datashaper/schema';
import {
	createDataPackageSchemaObject
} from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type { Maybe } from '@datashaper/workflow'
import { Workflow } from '@datashaper/workflow'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { Codebook } from './Codebook.js'
import type { DataSource } from './DataSource.js'
import type { ObservableResource, SchemaResource } from './types.js'

export class DataPackage
	implements ObservableResource, SchemaResource<DataPackageSchema>
{
	private readonly _onChange = new Subject<void>()
	private readonly _output = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)

	private _id: string
	private _codebook?: any
	private _outputSubscription?: Subscription

	public constructor(
		id: string,
		public readonly source: DataSource,
		public readonly workflow = new Workflow(),
		public readonly codebook = new Codebook(),
	) {
		this._id = id

		this.source.output.subscribe(table => {
			const tableContainer: TableContainer = { id, table }
			if (this.workflow.steps.length > 0) {
				this._setGraphInput()
			} else {
				this._output.next(tableContainer)
			}
		})

		this.workflow.onChange(() => {
			if (this._outputSubscription != null)
				this._outputSubscription.unsubscribe()
			if (this.workflow.steps.length > 0) {
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

	public get id(): string {
		return this._id
	}

	public set id(id: string) {
		this._id = id
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

	public onChange(handler: () => void): () => void {
		const sub = this._onChange.subscribe(handler)
		return () => sub.unsubscribe()
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

	public toSchema(): DataPackageSchema {
		const datafile = `${this.id}.${this.source.format}`
		const resources: string[] = [datafile, 'datasource.json']
		if (this.workflow.length > 0) {
			resources.push('workflow.json')
		}
		if (this._codebook.fields.length > 0) {
			resources.push('codebook.json')
		}
		return createDataPackageSchemaObject({
			resources,
		})
	}

	public loadSchema(_schema: DataPackageSchema | null | undefined): void {
		throw new Error('not implemented')
	}
}
