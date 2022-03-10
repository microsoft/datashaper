/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash-es/cloneDeep.js'

import type {
	ChangeListenerFunction,
	ListenerFunction,
	ResolverFunction,
	TableContainer,
	TableStore,
} from './types.js'

interface LazyTableStorage {
	container: TableContainer
	resolver?: ResolverFunction
	resolved: boolean
}

/**
 * Manages a set of tables.
 * Standard implementation of an async-resolving table store.
 */
export class DefaultTableStore implements TableStore {
	private _storage: Map<string, LazyTableStorage>
	private _changeListeners: ChangeListenerFunction[]
	private _tableListeners: Record<string, ListenerFunction>
	constructor(tables?: TableContainer[]) {
		this._storage = new Map<string, LazyTableStorage>()
		if (tables) {
			tables.forEach(table => {
				this._storage.set(table.id, {
					container: table,
					resolved: true,
				})
			})
		}
		this._changeListeners = []
		this._tableListeners = {}
	}

	async get(id: string): Promise<TableContainer> {
		const storage = this._storage.get(id)

		if (!storage) {
			throw new Error(`No table with id '${id}' found in store.`)
		}

		const { container } = storage

		if (!storage.resolved) {
			const { resolver } = storage
			if (!resolver) {
				throw new Error(`No resolver function for unloaded table '${id}'.`)
			}
			const table = await resolver(id)
			container.table = table

			// cache it for next time
			this.set(container)
		}
		return container
	}

	async table(id: string): Promise<ColumnTable> {
		const container = await this.get(id)
		return container.table!
	}

	set(container: TableContainer): TableStore {
		const storage = {
			container,
			resolved: true,
		}
		this._storage.set(container.id, storage)
		this.onChange(container.id)
		return this
	}

	delete(id: string): TableStore {
		this._storage.delete(id)
		this.onChange()
		return this
	}

	queue(id: string, resolver: ResolverFunction): TableStore {
		const storage = {
			container: {
				id,
			},
			resolved: false,
			resolver,
		}
		this._storage.set(id, storage)
		return this
	}

	list(filter?: (id: string) => boolean): string[] {
		const keys = Array.from(this._storage.keys())
		return keys.filter(filter || (() => true))
	}

	async toMap(): Promise<Map<string, TableContainer>> {
		const map = new Map<string, TableContainer>()
		for (const id of this._storage.keys()) {
			const resolved = await this.get(id)
			map.set(id, resolved)
		}
		return map
	}

	async toArray(): Promise<TableContainer[]> {
		const map = await this.toMap()
		return Array.from(map.values())
	}

	listen(id: string, listener: ListenerFunction): () => void {
		this._tableListeners[id] = listener
		return () => delete this._tableListeners[id]
	}

	unlisten(id: string): void {
		delete this._tableListeners[id]
	}

	addChangeListener(listener: ChangeListenerFunction): () => void {
		this._changeListeners.push(listener)
		return () => {
			const idx = this._changeListeners.findIndex(l => l === listener)
			if (idx >= 0) {
				this._changeListeners = this._changeListeners.splice(idx, 1)
			}
		}
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
			console.log(`--- ${ids[i]} ---`)
			const container = await this.get(ids[i]!)
			container.table?.print()
		}
	}

	async clone(): Promise<TableStore> {
		const tables = await this.toArray()
		return new DefaultTableStore(cloneDeep(tables))
	}

	clear(): TableStore {
		const keys = Array.from(this._storage.keys())
		keys.forEach(key => this.delete(key))
		return this
	}
}
