/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResolverFunction, TableContainer } from './tables.js'

/**
 * Function callback for table change listeners.
 */
export type ListenerFunction = (container: TableContainer) => void

/**
 * Function callback for general activity listener.
 */
export type ChangeListenerFunction = () => void

/**
 * Store for a collection of tables, used as an execution storage context for pipelines.
 */
export interface TableStore {
	/**
	 * Returns a table container.
	 * Uses async resolver function if necessary to lazy-load or retrieve remote tables.
	 * @param id - the table id
	 */
	get(id: string): Promise<TableContainer>

	/**
	 * Set a loaded table in the store.
	 * @param container - the table to set
	 */
	set(container: TableContainer): void

	/**
	 * Remove the named table
	 * @param id - the table id
	 */
	delete(id: string): void

	/**
	 * Add a table name to the store with a resolver function to be loaded when needed.
	 * @param id - the table id
	 * @param resolver - the table resolver
	 */
	setResolver(id: string, resolver: ResolverFunction): void

	/**
	 * List all tables in the store by id, with an optional filter function.
	 * @param filter - the table name filter
	 * @returns a list of table names that match the filter (if defined), else all the table names
	 */
	list(filter?: (id: string) => boolean): string[]

	/**
	 * Resolves all tables and converts to a id:table Map
	 */
	toMap(): Promise<Map<string, TableContainer>>

	/**
	 * Resolves all tables and convers to an array
	 */
	toArray(): Promise<TableContainer[]>

	/**
	 * Add a listener for a particular table.
	 * Returns an unlisten handler.
	 * @param id - the table id
	 * @param listener - the listener function
	 */
	listen(id: string, listener: ListenerFunction): () => void

	/**
	 * Get alerted for any changes in the store.
	 * Returns an unlisten handler.
	 * @param listener - the onChange listener
	 */
	onChange(listener: ChangeListenerFunction): () => void

	/**
	 * Print the whole store to the console.
	 */
	print(): Promise<void>

	/**
	 * Deeps clones the tables in this store for creating sub-contexts, etc.
	 */
	clone(): Promise<TableStore>

	/**
	 * Deletes all tables from store
	 */
	clear(): void
}
