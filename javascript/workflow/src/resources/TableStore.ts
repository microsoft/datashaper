/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import { BehaviorSubject } from 'rxjs'

import type { DataTable } from './DataTable.js'
import { Observed } from './Observed.js'

export class TableStore extends Observed {
	private _tables: Map<string, DataTable> = new Map()
	private _tablesObservable = new BehaviorSubject<DataTable[]>([])

	public add(table: DataTable): void {
		let { name } = table
		this._tables.set(name, table)
		table.onChange(() => {
			if (name !== table.name) {
				this._tables.delete(name)
				this._tables.set(table.name, table)
				name = table.name
				this._emitTables()
			}
		})
		this._emitTables()
	}

	public remove(name: string): void {
		this._tables.delete(name)
		this._emitTables()
	}

	public get(name: string): DataTable | undefined {
		return this._tables.get(name)
	}

	public get size(): number {
		return this._tables.size
	}

	public get names(): string[] {
		return [...this._tables.keys()]
	}

	public clear(): void {
		this._tables.clear()
		this._emitTables()
	}

	public get tables(): BehaviorSubject<DataTable[]> {
		return this._tablesObservable
	}

	private _emitTables(): void {
		this._tablesObservable.next([...this._tables.values()])
		this._onChange.next()
	}
}
