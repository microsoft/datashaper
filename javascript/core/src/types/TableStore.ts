/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

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
	 * @param id -
	 */
	get(id: string): Promise<TableContainer>
	table(id: string): Promise<ColumnTable>
	/**
	 * Set a loaded table in the store.
	 * @param id -
	 * @param table -
	 */
	set(container: TableContainer): TableStore
	/**
	 * Remove the named table
	 * @param id -
	 */
	delete(id: string): TableStore
	/**
	 * Add a table name to the store with a resolver function to be loaded when needed.
	 * @param id -
	 * @param resolver -
	 */
	queue(id: string, resolver: ResolverFunction): TableStore
	/**
	 * List all tables in the store by id, with an optional filter function.
	 * @param filter -
	 * @returns
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
	 * @param id -
	 * @param listener -
	 */
	listen(id: string, listener: ListenerFunction): () => void
	/**
	 * Stop listening for a particular table.
	 * @param id -
	 */
	unlisten(id: string): void
	/**
	 * Get alerted for any changes in the store.
	 * Returns an unlisten handler.
	 * @param listener -
	 */
	addChangeListener(listener: ChangeListenerFunction): () => void
	/**
	 * Print the whole store to the console.
	 */
	print(): Promise<void>
	/**
	 * Deeps clones the tables in this store for creating sub-contexts, etc.
	 * @returns
	 */
	clone(): Promise<TableStore>
	/**
	 * Deletes all tables from store
	 * @returns
	 */
	clear(): TableStore
}
