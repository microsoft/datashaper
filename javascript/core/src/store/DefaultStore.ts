/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject, Subject } from 'rxjs'

import type { Handler, HandlerOf, Maybe, Unsubscribe } from '../primitives.js'
import type { Store } from './types.js'

interface ItemStorage<T> {
	cached: Maybe<T>
	observable: Observable<T>
	subscription: Subscription
}

/**
 * Manages a set of items.
 * Standard implementation of an async-resolving item store.
 */
export class DefaultStore<T> implements Store<T> {
	private _storage: Map<string, ItemStorage<T>> = new Map()
	private _itemEvents: Map<string, BehaviorSubject<Maybe<T>>> = new Map()
	private _changeEvent = new Subject<void>()

	public constructor(private _printItem: (item: T) => void) {}

	public get(id: string): Maybe<T> {
		if (!this._storage.has(id)) {
			throw new Error(`table "${id}" not defined`)
		}
		return this._storage.get(id)?.cached
	}

	public observe(id: string): Observable<Maybe<T>> {
		return this.eventFor(id)
	}

	public set(id: string, value: Observable<T>): void {
		// clear any previous value
		this.delete(id)

		// wire in the new observable, watch for updates
		const storage: Partial<ItemStorage<T>> = { observable: value }
		storage.subscription = value.subscribe(v => {
			storage.cached = v
			this.emit(id, v)
		})
		this._storage.set(id, storage as ItemStorage<T>)
	}

	public delete(id: string): void {
		const existing = this._storage.get(id)
		if (existing) {
			existing.subscription.unsubscribe()
			this._storage.delete(id)
		}
	}

	public clear(): void {
		const keys = Array.from(this._storage.keys())
		keys.forEach(key => this.delete(key))
	}

	public list(filter?: (id: string) => boolean): string[] {
		const keys = Array.from(this._storage.keys())
		return keys.filter(filter || (() => true))
	}

	public onItemChange(id: string, listener: HandlerOf<Maybe<T>>): Unsubscribe {
		const sub = this.eventFor(id).subscribe(listener)
		return () => sub.unsubscribe()
	}

	public onChange(listener: Handler): Unsubscribe {
		const sub = this._changeEvent.subscribe(listener)
		return () => sub.unsubscribe()
	}

	private emit(id?: string, value?: T): void {
		if (id) {
			this.eventFor(id).next(value)
		}
		this._changeEvent.next()
	}

	private eventFor(id: string): Subject<Maybe<T>> {
		if (!this._itemEvents.has(id)) {
			this._itemEvents.set(id, new BehaviorSubject<Maybe<T>>(undefined))
		}
		return this._itemEvents.get(id) as Subject<Maybe<T>>
	}

	public toMap(): Map<string, Maybe<T>> {
		const map = new Map<string, Maybe<T>>()
		for (const id of this._storage.keys()) {
			map.set(id, this.get(id))
		}
		return map
	}

	public toArray(): Maybe<T>[] {
		const map = this.toMap()
		return Array.from(map.values())
	}

	public print(): void {
		const ids = this.list()
		for (let i = 0; i < ids.length; i++) {
			console.log(`--- ${ids[i]} ---`)
			const item = this.get(ids[i]!)
			item && this._printItem(item)
		}
	}
}
