/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { internal as ArqueroTypes } from 'arquero'

export type ResolverFunction = (
	name: string,
) => Promise<ArqueroTypes.ColumnTable>

/**
 * Function callback for table change listeners.
 */
export type ListenerFunction = (table: ArqueroTypes.ColumnTable) => void

/**
 * Function callback for general activity listener.
 */
export type ChangeListenerFunction = () => void

export interface TableContainer {
	name: string
	table?: ArqueroTypes.ColumnTable
	resolver?: ResolverFunction
}

/**
 * Manages a set of tables with async loading.
 */
export class TableStore {
	private _tables: Map<string, TableContainer>
	private _changeListeners: ChangeListenerFunction[]
	private _tableListeners: Record<string, ListenerFunction>
	constructor() {
		this._tables = new Map<string, TableContainer>()
		this._changeListeners = []
		this._tableListeners = {}
	}
	/**
	 * Returns a named table.
	 * Uses async resolver function if necessary to lazy-load or retrieve remote tables.
	 * @param name
	 */
	async get(name: string): Promise<ArqueroTypes.ColumnTable> {
		const container = this._tables.get(name)
		if (!container) {
			throw new Error(`No table named '${name}' found in store.`)
		}
		let table = container.table
		if (!table) {
			const { resolver } = container
			if (!resolver) {
				throw new Error(`No resolver function for unloaded table '${name}'.`)
			}
			table = await resolver(name)
			// cache it for next time
			this.set(name, table)
		}
		return table
	}
	/**
	 * Set a loaded table in the store.
	 * @param name
	 * @param table
	 */
	set(name: string, table: ArqueroTypes.ColumnTable): void {
		this._tables.set(name, {
			name,
			table,
		})
		this.onChange(name)
	}
	/**
	 * Remove the named table
	 * @param name
	 */
	delete(name: string): void {
		this._tables.delete(name)
		this.onChange()
	}
	/**
	 * Add a table name to the store with a resolver function to be loaded when needed.
	 * @param name
	 * @param resolver
	 */
	queue(name: string, resolver: ResolverFunction): void {
		this._tables.set(name, {
			name,
			resolver,
		})
	}
	/**
	 * List all tables in the store by name, with an optional filter function.
	 * @param filter
	 * @returns
	 */
	list(filter?: (name: string) => boolean): string[] {
		const keys = Array.from(this._tables.keys())
		return keys.filter(filter || (() => true))
	}
	/**
	 * Resolves all tables and converts to a name:table Map
	 */
	async toMap(): Promise<Map<string, ArqueroTypes.ColumnTable>> {
		const map = new Map<string, ArqueroTypes.ColumnTable>()
		for (const container of this._tables) {
			const [name] = container
			const table = await this.get(name)
			map.set(name, table)
		}
		return map
	}
	/**
	 * Add a listener for a particular table.
	 * @param name
	 * @param listener
	 */
	listen(name: string, listener: ListenerFunction): void {
		this._tableListeners[name] = listener
	}
	/**
	 * Stop listening for a particular table.
	 * @param name
	 */
	unlisten(name: string): void {
		delete this._tableListeners[name]
	}
	/**
	 * Get alerted for any changes in the store.
	 * @param listener
	 */
	addChangeListener(listener: ChangeListenerFunction): void {
		this._changeListeners.push(listener)
	}
	private onChange(name?: string): void {
		const fn = async () => {
			if (name) {
				const table = await this.get(name)
				const listener = this._tableListeners[name]
				listener && listener(table)
			}
			this._changeListeners.forEach(l => l())
		}
		fn()
	}
	/**
	 * Print the whole store to the console.
	 */
	async print(): Promise<void> {
		const names = this.list()
		for (let i = 0; i < names.length; i++) {
			console.log(names[i])
			const table = await this.get(names[i])
			table.print()
		}
	}
}
