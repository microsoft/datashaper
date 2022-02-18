/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

/**
 * Resolver function that looks up a table by id.
 */
export type ResolverFunction = (id: string) => Promise<ColumnTable>

/**
 * Function callback for table change listeners.
 */
export type ListenerFunction = (containre: TableContainer) => void

/**
 * Function callback for general activity listener.
 */
export type ChangeListenerFunction = () => void

export interface TableContainer {
	/**
	 * This is the formal id for a table, and must be unique within the store.
	 * A URI would normally be appropriate.
	 */
	id: string
	/**
	 * This is an optional alias or friendly name for the table.
	 */
	name?: string
	/**
	 * This is the actual Arquero table instance to store.
	 * If it has not been resolved yet it will be undefined.
	 */
	table?: ColumnTable
	/**
	 * Optional resolver function to lazy-load a table when first requested.
	 * If a table is not found, the resolver will be invoked or an error thrown.
	 */
	resolver?: ResolverFunction
}

/**
 * Store for a collection of tables, used as an execution storage context for pipelines.
 */
export interface TableStore {
	/**
	 * Returns a table container.
	 * Uses async resolver function if necessary to lazy-load or retrieve remote tables.
	 * @param id
	 */
	get(id: string): Promise<TableContainer>
	table(id: string): Promise<ColumnTable>
	/**
	 * Set a loaded table in the store.
	 * @param id
	 * @param table
	 */
	set(container: TableContainer): void
	/**
	 * Remove the named table
	 * @param id
	 */
	delete(id: string): void
	/**
	 * Add a table name to the store with a resolver function to be loaded when needed.
	 * @param id
	 * @param resolver
	 */
	queue(id: string, resolver: ResolverFunction): void
	/**
	 * List all tables in the store by id, with an optional filter function.
	 * @param filter
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
	 * @param id
	 * @param listener
	 */
	listen(id: string, listener: ListenerFunction): void
	/**
	 * Stop listening for a particular table.
	 * @param id
	 */
	unlisten(id: string): void
	/**
	 * Get alerted for any changes in the store.
	 * @param listener
	 */
	addChangeListener(listener: ChangeListenerFunction): void
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
	clear(): void
}
