/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cloneDeep from 'lodash-es/cloneDeep.js'
import { BehaviorSubject, Subject } from 'rxjs'

import type {
	Listener,
	Maybe,
	ResolverFunction,
	TableContainer,
	TableListener,
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
	private _storage: Map<string, LazyTableStorage> = new Map()
	private _changeListeners = new Subject<void>()
	private _tableListeners: Record<
		string,
		BehaviorSubject<Maybe<TableContainer>>
	> = {}

	constructor(tables?: TableContainer[]) {
		// preload any existing data tables
		tables?.forEach(table => {
			this._storage.set(table.id, {
				container: table,
				resolved: true,
			})
		})
	}

	public async get(id: string): Promise<TableContainer> {
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

	public set(container: TableContainer): void {
		const storage = {
			container,
			resolved: true,
		}
		this._storage.set(container.id, storage)
		this.emit(container.id)
	}

	public delete(id: string): void {
		this._storage.delete(id)
		this.emit()
	}

	public setResolver(id: string, resolver: ResolverFunction): void {
		const storage = {
			container: { id },
			resolved: false,
			resolver,
		}
		this._storage.set(id, storage)
	}

	public list(filter?: (id: string) => boolean): string[] {
		const keys = Array.from(this._storage.keys())
		return keys.filter(filter || (() => true))
	}

	public async toMap(): Promise<Map<string, TableContainer>> {
		const map = new Map<string, TableContainer>()
		for (const id of this._storage.keys()) {
			const resolved = await this.get(id)
			map.set(id, resolved)
		}
		return map
	}

	public async toArray(): Promise<TableContainer[]> {
		const map = await this.toMap()
		return Array.from(map.values())
	}

	public listen(id: string, listener: TableListener): () => void {
		if (!this._tableListeners[id]) {
			this._tableListeners[id] = new BehaviorSubject<Maybe<TableContainer>>(
				undefined,
			)
		}
		const subscription = this._tableListeners[id]?.subscribe(listener)
		return () => subscription?.unsubscribe()
	}

	public onChange(listener: Listener): () => void {
		const subscription = this._changeListeners.subscribe(listener)
		return () => subscription.unsubscribe()
	}

	private emit(id?: string): void {
		const fn = async () => {
			if (id) {
				const container = await this.get(id)
				this._tableListeners[id]?.next(container)
			}
			this._changeListeners.next()
		}
		void fn()
	}

	public async print(): Promise<void> {
		const ids = this.list()
		for (let i = 0; i < ids.length; i++) {
			console.log(`--- ${ids[i]} ---`)
			const container = await this.get(ids[i]!)
			container.table?.print()
		}
	}

	public async clone(): Promise<TableStore> {
		const tables = await this.toArray()
		return new DefaultTableStore(cloneDeep(tables))
	}

	public clear(): void {
		const keys = Array.from(this._storage.keys())
		keys.forEach(key => this.delete(key))
	}
}
