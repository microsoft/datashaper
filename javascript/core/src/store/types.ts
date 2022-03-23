/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Observable } from 'rxjs'

import type { Handler, HandlerOf, Maybe, Unsubscribe } from '../primitives.js'

/**
 * Store for a collection of tables, used as an execution storage context for pipelines.
 */
export interface Store<T> {
	/**
	 * Get a cached value.
	 * @param id - the item id
	 * @returns the value if available, otherwise undefined
	 */
	get(id: string): Maybe<T>

	/**
	 * Set a value into the store.
	 * @param id - the item id
	 * @param value - the item value
	 */
	set(id: string, value: Observable<Maybe<T>>): void

	/**
	 * Remove the named item
	 * @param id - The item id
	 */
	delete(id: string): void

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
	list(filter?: (id: string) => boolean): string[]

	/**
	 * Add a listener for a particular item.
	 * Returns an unlisten handler.
	 * @param id - The id to listen for
	 * @param listener - The listener callback
	 * @returns an unsubscribe hook
	 */
	onItemChange(id: string, listener: HandlerOf<Maybe<T>>): Unsubscribe

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
	toMap(): Map<string, Maybe<T>>

	/**
	 * Resolves all items and convers to an array
	 */
	toArray(): Maybe<T>[]

	/**
	 * Print the whole store to the console.
	 */
	print(): void
}
