/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash-es/cloneDeep.js'
import type {
	TableStore,
	ResolverFunction,
	TableContainer,
	ChangeListenerFunction,
	ListenerFunction,
} from './types.js'

/**
 * Manages a set of tables.
 * Standard implementation of an async-resolving table store.
 */
export class DefaultTableStore implements TableStore {
	private _tables: Map<string, TableContainer>
	private _changeListeners: ChangeListenerFunction[]
	private _tableListeners: Record<string, ListenerFunction>
	constructor(tables?: TableContainer[]) {
		this._tables = new Map<string, TableContainer>()
		if (tables) {
			tables.forEach(table => {
				this._tables.set(table.id, table)
			})
		}
		this._changeListeners = []
		this._tableListeners = {}
	}

	async get(id: string): Promise<TableContainer> {
		const container = this._tables.get(id)
		if (!container) {
			throw new Error(`No table with id '${id}' found in store.`)
		}
		let table = container.table
		if (!table) {
			const { resolver } = container
			if (!resolver) {
				throw new Error(`No resolver function for unloaded table '${id}'.`)
			}
			table = await resolver(id)
			// cache it for next time
			this.set({
				...container,
				table,
			})
		}
		return container
	}

	async table(id: string): Promise<ColumnTable> {
		const container = await this.get(id)
		return container.table!
	}

	set(container: TableContainer): void {
		this._tables.set(container.id, container)
		this.onChange(container.id)
	}

	delete(id: string): void {
		this._tables.delete(id)
		this.onChange()
	}

	queue(id: string, resolver: ResolverFunction): void {
		this._tables.set(id, {
			id,
			resolver,
		})
	}

	list(filter?: (id: string) => boolean): string[] {
		const keys = Array.from(this._tables.keys())
		return keys.filter(filter || (() => true))
	}

	async toMap(): Promise<Map<string, TableContainer>> {
		const map = new Map<string, TableContainer>()
		for (const container of this._tables) {
			const [id] = container
			const resolved = await this.get(id)
			map.set(id, resolved)
		}
		return map
	}

	async toArray(): Promise<TableContainer[]> {
		const map = await this.toMap()
		return Array.from(map.values())
	}

	listen(id: string, listener: ListenerFunction): void {
		this._tableListeners[id] = listener
	}

	unlisten(id: string): void {
		delete this._tableListeners[id]
	}

	addChangeListener(listener: ChangeListenerFunction): void {
		this._changeListeners.push(listener)
	}
	private onChange(id?: string): void {
		const fn = async () => {
			if (id) {
				const container = await this.get(id)
				const listener = this._tableListeners[id]
				listener && listener(container)
			}
			this._changeListeners.forEach(l => l())
		}
		fn()
	}

	async print(): Promise<void> {
		const ids = this.list()
		for (let i = 0; i < ids.length; i++) {
			console.log(ids[i])
			const container = await this.get(ids[i] as string)
			container.table?.print()
		}
	}

	async clone(): Promise<TableStore> {
		const tables = await this.toArray()
		return new DefaultTableStore(cloneDeep(tables))
	}

	clear(): void {
		const keys = Array.from(this._tables.keys())
		keys.forEach(key => this.delete(key))
	}
}
