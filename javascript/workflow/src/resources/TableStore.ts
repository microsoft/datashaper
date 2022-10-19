/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type { Observable } from 'rxjs';
import { BehaviorSubject, map } from 'rxjs'

import type { DataTable } from './DataTable.js'
import { Observed } from './Observed.js'

export class TableStore extends Observed {
	public _tables = new BehaviorSubject<DataTable[]>([])

	public get tables(): DataTable[] {
		return this._tables.value
	}

	public get tables$(): Observable<DataTable[]> {
		return this._tables
	}

	public get size(): number {
		return this.tables.length
	}

	public get size$(): Observable<number> {
		return this._tables.pipe(map(tables => tables.length))
	}

	public get names(): string[] {
		return this.tables.map(t => t.name)
	}

	public get names$(): Observable<string[]> {
		return this._tables.pipe(map(tables => tables.map(t => t.name)))
	}

	public add(table: DataTable): void {
		this._tables.next([
			...this.tables.filter(t => t.name !== table.name),
			table,
		])
		this._onChange.next()
	}

	public remove(name: string): void {
		this._tables.next(this.tables.filter(t => name !== t.name))
		this._onChange.next()
	}

	public get(name: string): DataTable | undefined {
		return this.tables.find(t => t.name === name)
	}

	public clear(): void {
		this._tables.next([])
		this._onChange.next()
	}
}
