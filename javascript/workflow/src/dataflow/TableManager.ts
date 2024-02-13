/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'
import type { TableContainer } from '@datashaper/tables'
import type { BehaviorSubject, Observable } from 'rxjs'

import type { Maybe } from '../primitives.js'
import type { TableObservable } from '../resources/index.js'
import { DelegateSubject } from '../util/DelegateSubject.js'
const log = debug('datashaper:workflow')

export enum RemoveMode {
	Hard = 'hard',
	Soft = 'soft',
}

/**
 * A workflow-subclass for managing named tables and default I/O
 */
export class TableManager {
	private readonly _defaultOutput$ = new DelegateSubject<TableContainer>()
	private readonly _defaultInput$ = new DelegateSubject<TableContainer>()
	private readonly _tables = new Map<string, DelegateSubject<TableContainer>>()

	/**
	 * The default input observable
	 */
	public get defaultInput$(): BehaviorSubject<Maybe<TableContainer>> {
		return this._defaultInput$
	}

	/**
	 * The default output observable
	 */
	public get defaultOutput$(): BehaviorSubject<Maybe<TableContainer>> {
		return this._defaultOutput$
	}

	/**
	 * Set the default input observable (does not change underlying observable, just delegation link)
	 */
	public set defaultInput$(source:
		| Observable<Maybe<TableContainer>>
		| undefined) {
		this._defaultInput$.input = source
	}

	/**
	 * Set the default output observable (does not change underlying observable, just delegation link)
	 */
	public set defaultOutput$(source:
		| Observable<Maybe<TableContainer>>
		| undefined) {
		this._defaultOutput$.input = source
	}

	/**
	 * Get the default input value
	 */
	public get defaultInput(): Maybe<TableContainer> {
		return this._defaultInput$.value
	}

	/**
	 * Set the default input value
	 */
	public set defaultInput(source: Maybe<TableContainer>) {
		log(`set default input source, ${source != null}`)
		this._defaultInput$.next(source)
	}

	/**
	 * Get a table value by id
	 * @param id - The table id to get the value for
	 * @returns The table value or undefined
	 */
	public get(id: string): Maybe<TableContainer> {
		return this.get$(id).value
	}

	/**
	 * Get a table observable by id
	 * @param id - The table id to get the observable for
	 * @returns The observable for the table id
	 */
	public get$(id: string): BehaviorSubject<Maybe<TableContainer>> {
		const found = this._tables.get(id)
		if (!found) {
			throw new Error(`No table with id ${id}`)
		}
		return found
	}

	/**
	 * Sets the source observable for an input name;
	 * @param id - The input table id
	 * @param source - The source observable
	 * @returns The stable observable for the table id
	 */
	public bind(
		id: string,
		source: TableObservable,
	): Observable<Maybe<TableContainer>> {
		const [subject] = this.ensure(id)
		subject.input = source
		return subject
	}

	/**
	 * The input table to delete
	 * @param id - The input table id to remove
	 * @param hard - Whether to remove the output observable as well. This may affect listener stability.
	 */
	public remove(id: string, mode: RemoveMode): void {
		const existing = this._tables.get(id)
		if (existing != null) {
			if (mode === RemoveMode.Hard) {
				existing.dispose()
				this._tables.delete(id)
			} else {
				existing.input = undefined
			}
		}
	}

	/**
	 * Ensure that an table observable exist in the tablestore
	 * @param id - The table id to ensure exists
	 * @returns A delegatesubject for the table id and a boolean indicating whether the table was created
	 */
	public ensure(id: string): [DelegateSubject<TableContainer>, boolean] {
		let created = false
		if (!this._tables.has(id)) {
			this._tables.set(id, new DelegateSubject<TableContainer>())
			created = true
		}

		const result = this._tables.get(id)
		if (result == null) {
			throw new Error(`could not get table with id ${id}`)
		}
		return [result, created]
	}

	/**
	 * Dispose of the table manager and all of its tables
	 */
	public dispose(): void {
		for (const t of this._tables.values()) {
			t.dispose()
		}
		this._defaultInput$.dispose()
		this._defaultOutput$.dispose()
	}

	/**
	 * Get a list of tables by name
	 * @param names - The table names to emit
	 * @param includeDefaultInput - Whether to include the default input table
	 * @param includeDefaultOutput - Whether to include the default output table
	 * @returns A list of tables
	 */
	public toArray(
		names: string[],
		includeDefaultInput: boolean | undefined,
		includeDefaultOutput: boolean | undefined,
	): Maybe<TableContainer>[] {
		const result: Maybe<TableContainer>[] = []
		const addTable = (name: string) => result.push(this.get(name))
		if (includeDefaultInput) {
			result.push(this._defaultInput$.value)
		}
		names.forEach(addTable)

		if (includeDefaultOutput) {
			result.push(this._defaultOutput$.value)
		}
		return result
	}
}
