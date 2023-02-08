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

export class TableManager {
	private readonly _defaultOutput$ = new DelegateSubject<TableContainer>()
	private readonly _defaultInput$ = new DelegateSubject<TableContainer>()
	private readonly _tables = new Map<string, DelegateSubject<TableContainer>>()

	/**
	 * The default input observable
	 */
	public get in$(): BehaviorSubject<Maybe<TableContainer>> {
		return this._defaultInput$
	}

	/**
	 * The default output observable
	 */
	public get out$(): BehaviorSubject<Maybe<TableContainer>> {
		return this._defaultOutput$
	}

	public dispose(): void {
		for (const t of this._tables.values()) {
			t.dispose()
		}
		this._defaultInput$.dispose()
		this._defaultOutput$.dispose()
	}

	/**
	 * Sets the source observable for an input name;
	 * @param id - The input table id
	 * @param source - The source observable
	 * @returns The stable observable for the table id
	 */
	public setSource(
		id: string,
		source: TableObservable,
	): Observable<Maybe<TableContainer>> {
		const [subject] = this.ensure(id)
		subject.input = source
		return subject
	}

	public setDefaultOutputSource(
		source: Observable<Maybe<TableContainer>> | undefined,
	): void {
		this._defaultOutput$.input = source
	}

	public setDefaultInputSource(
		source: Observable<Maybe<TableContainer>> | undefined,
	): void {
		log(`set default input source, ${source != null}`)
		this._defaultInput$.input = source
	}

	public setDefaultInput(source: Maybe<TableContainer>): void {
		this._defaultInput$.next(source)
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

	public get(id: string): Maybe<TableContainer> {
		return this._tables.get(id)?.value
	}

	public get$(id: string): BehaviorSubject<Maybe<TableContainer>> {
		const found = this._tables.get(id)
		if (!found) {
			throw new Error(`No table with id ${id}`)
		}
		return found
	}

	public ensure(id: string): [DelegateSubject<TableContainer>, boolean] {
		let created = false
		if (!this._tables.has(id)) {
			this._tables.set(id, new DelegateSubject<TableContainer>())
			created = true
		}
		return [this._tables.get(id)!, created]
	}

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
