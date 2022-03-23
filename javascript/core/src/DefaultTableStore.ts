/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-empty-function */
import type ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash-es/cloneDeep.js'
import type { Observable, Subscription } from 'rxjs'
import { Subject } from 'rxjs'

import type {
	ChangeListenerFunction,
	ListenerFunction,
	TableContainer,
	TableStore,
	Unsubscribe,
} from './types.js'

interface StorageCell<T> {
	readonly resolved: boolean
	get(): Promise<T>
	onChange(handler: ChangeListenerFunction): void
	clone(): StorageCell<T>
	dispose(): void
}

class StaticStorageCell<T> implements StorageCell<T> {
	public readonly resolved = true
	constructor(private _value: T) {}

	public get(): Promise<T> {
		return Promise.resolve(this._value)
	}

	public onChange() {}
	public dispose() {}

	public clone() {
		return new StaticStorageCell(this._value)
	}
}

class ResolvingStorageCell<T> implements StorageCell<T> {
	public resolved = false
	private _result: T | undefined

	constructor(private _resolver: () => Promise<T>) {}

	public async get(): Promise<T> {
		if (this._result == null) {
			this._result = await this._resolver()
			this.resolved = true
		}
		return this._result
	}

	public onChange() {}
	public dispose() {}

	public clone() {
		const clone = new ResolvingStorageCell(this._resolver)
		clone._result = this._result
		return clone
	}
}

class ObservableStorageCell<T> implements StorageCell<T> {
	private _current: T | undefined
	private _subscriptions: Subscription[] = []
	public resolved = false
	private _resolve?: (c: T) => void
	private _promise = new Promise<T>(resolve => (this._resolve = resolve))

	constructor(private _observable: Observable<T | undefined>) {
		this._subscriptions.push(
			this._observable.subscribe(value => {
				this._current = value
				if (value) {
					this.resolved = true
					this._resolve && this._resolve(value)
				}
			}),
		)
	}

	public async get(): Promise<T> {
		return this._promise
	}

	public onChange(handler: ChangeListenerFunction): void {
		const sub = this._observable.subscribe(handler)
		this._subscriptions.push(sub)
	}

	public dispose() {
		this._subscriptions.forEach(s => s.unsubscribe())
	}

	public clone(): StorageCell<T> {
		const clone = new ObservableStorageCell<T>(this._observable)
		clone._current = this._current
		return clone
	}
}

/**
 * Manages a set of tables.
 * Standard implementation of an async-resolving table store.
 */
export class DefaultTableStore implements TableStore {
	private _storage: Map<string, StorageCell<TableContainer>> = new Map()
	private _changeEvent = new Subject<void>()
	private _tableChangeEvents = new Map<string, Subject<TableContainer>>()

	public constructor(tables?: TableContainer[]) {
		if (tables) {
			tables.forEach(table => {
				this._storage.set(table.id, new StaticStorageCell(table))
			})
		}
	}

	public async get(id: string): Promise<TableContainer> {
		const storage = this._storage.get(id)
		if (!storage) {
			throw new Error(`No table with id '${id}' found in store.`)
		}
		return storage.get()
	}

	public async table(id: string): Promise<ColumnTable> {
		const container = await this.get(id)
		return container.table!
	}

	public set(container: TableContainer): TableStore {
		this._storage.set(container.id, new StaticStorageCell(container))
		this.emit(container.id)
		return this
	}

	public setResolver(
		id: string,
		resolver: () => Promise<TableContainer>,
	): TableStore {
		this._storage.set(id, new ResolvingStorageCell(resolver))
		return this
	}

	public setObservable(
		id: string,
		observable: Observable<TableContainer<unknown> | undefined>,
	): TableStore {
		const cell = new ObservableStorageCell(observable)
		cell.onChange(() => this.emit(id))
		this._storage.set(id, cell)
		return this
	}

	public delete(id: string): TableStore {
		const cell = this._storage.get(id)
		cell?.dispose()
		this._storage.delete(id)
		this.emit()
		return this
	}

	public clear(): TableStore {
		const keys = Array.from(this._storage.keys())
		keys.forEach(key => this.delete(key))
		return this
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

	public onTableChange(id: string, listener: ListenerFunction): Unsubscribe {
		const subscription = this.tableChangeEvent(id).subscribe(listener)
		return () => subscription.unsubscribe()
	}

	public onChange(listener: ChangeListenerFunction): Unsubscribe {
		const subscription = this._changeEvent.subscribe(listener)
		return () => subscription.unsubscribe()
	}

	public async print(): Promise<void> {
		const ids = this.list()
		for (let i = 0; i < ids.length; i++) {
			console.log(`--- ${ids[i]} ---`)
			const container = await this.get(ids[i]!)
			container.table?.print()
		}
	}

	private tableChangeEvent(id: string): Subject<TableContainer> {
		if (!this._tableChangeEvents.get(id)) {
			this._tableChangeEvents.set(id, new Subject())
		}
		return this._tableChangeEvents.get(id) as Subject<TableContainer>
	}

	public async clone(): Promise<TableStore> {
		const tables = await this.toArray()
		return new DefaultTableStore(cloneDeep(tables))
	}

	private emit(id?: string): void {
		const fn = async () => {
			if (id) {
				const container = await this.get(id)
				this.tableChangeEvent(id).next(container)
			}
			this._changeEvent.next()
		}
		fn()
	}
}
