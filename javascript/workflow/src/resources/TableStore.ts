/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type { DataTable } from './DataTable.js'
import { Observed } from './Observed.js'

export class TableStore extends Observed {
	private _tables: Map<string, DataTable> = new Map()

	public add(table: DataTable): void {
		let { name } = table
		this._tables.set(name, table)
		table.onChange(() => {
			if (name !== table.name) {
				this._tables.delete(name)
				this._tables.set(table.name, table)
				name = table.name

				this._onChange.next()
			}
		})
		this._onChange.next()
	}

	public remove(name: string): void {
		this._tables.delete(name)
		this._onChange.next()
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
		this._onChange.next()
	}

	public get tables(): Map<string, DataTable> {
		return this._tables
	}
}
