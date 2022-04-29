/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

import type { Handler, HandlerOf, Maybe, Unsubscribe } from '../primitives.js'

/**
 * Store for a collection of tables, used as an execution storage context for pipelines.
 */
export interface Store<T, K = string> {
	/**
	 * Get a cached value.
	 * @param id - the item id
	 * @returns the value if available, otherwise undefined
	 */
	get(id: K): Maybe<T>

	/**
	 * Observe changes to an item. If not defined, will emit when defined
	 * @param id - the id of the item to observe changes in
	 */
	observe(id: K): Observable<Maybe<T>>

	/**
	 * Set a value into the store.
	 * @param id - the item id
	 * @param value - the item value
	 */
	set(id: K, value: Observable<Maybe<T>> | T | Promise<Maybe<T>>): void

	/**
	 * Remove the named item
	 * @param id - The item id
	 */
	delete(id: K): void

	/**
	 * Deletes all items from store
	 * @returns
	 */
	clear(): void

	/**
	 * List all items in the store by id, with an optional filter function.
	 * @param filter - the name filter predicate
	 * @returns The list of values known by the store
	 */
	list(filter?: (id: K) => boolean): K[]

	/**
	 * Add a listener for a particular item.
	 * Returns an unlisten handler.
	 * @param id - The id to listen for
	 * @param listener - The listener callback
	 * @returns an unsubscribe hook
	 */
	onItemChange(id: K, listener: HandlerOf<Maybe<T>>): Unsubscribe

	/**
	 * Emits an item-change notification. Useful for when clients mutate store items.
	 * @param id - the item id
	 */
	emitItemChange(id: string): void

	/**
	 * Get alerted for any changes in the store.
	 * (e.g. values are added, removed, or changed)
	 *
	 * @param listener - The listener callback
	 * @returns an unsubuscribe hook
	 */
	onChange(listener: Handler): Unsubscribe

	/**
	 * Resolves all items and converts to a id:item Map
	 */
	toMap(): Map<K, T>

	/**
	 * Resolves all items and convers to an array
	 */
	toArray(): Maybe<T>[]

	/**
	 * Print the whole store to the console.
	 */
	print(): void
}
