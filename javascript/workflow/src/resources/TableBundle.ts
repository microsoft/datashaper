/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableBundleSchema } from '@datashaper/schema'
import { KnownProfile, LATEST_TABLEBUNDLE_SCHEMA } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import { introspect } from '@datashaper/tables'
import type { Observable, Subscription } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'

import {
	dereference,
	isTableEmitter,
	isTableTransformer,
} from '../predicates.js'
import type { Maybe } from '../primitives.js'
import { Resource } from './Resource.js'
import type { Readable, TableEmitter } from './types.js'

export class TableBundle extends Resource implements TableEmitter {
	public readonly $schema = LATEST_TABLEBUNDLE_SCHEMA
	public readonly profile = KnownProfile.TableBundle

	private readonly _input$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private readonly _output$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private _pipelineSub?: Subscription | undefined

	public constructor(data?: Readable<TableBundleSchema>) {
		super()
		this.loadSchema(data)
	}

	public override get sources(): Resource[] {
		return super.sources
	}

	public override set sources(value: Resource[]) {
		const dereferenced = value.map(dereference)
		const inputCount = dereferenced.filter(isTableEmitter).length
		if (inputCount > 1) {
			throw new Error(
				`TableBundle can only have one input, found ${inputCount}}`,
			)
		}

		super.sources = value
		this._pipelineSub?.unsubscribe()

		// Create a pipeline of transformers
		const inputNode = dereferenced.find(isTableEmitter)
		const transformers = dereferenced.filter(isTableTransformer)

		// Wire the transformers together
		for (let i = 0; i < transformers.length; i++) {
			const t = transformers[i]
			if (t != null) {
				if (i === 0) {
					t.input$ = inputNode?.output$
				} else {
					t.input$ = transformers[i - 1]?.output$
				}
			}
		}

		const lastNode =
			transformers.length > 0
				? transformers[transformers.length - 1]
				: inputNode

		this._pipelineSub = lastNode?.output$
			.pipe(map(this.renameTable), map(this.computeMeta))
			.subscribe(out => this._output$.next(out))

		this._onChange.next()
	}

	public get input(): TableEmitter | undefined {
		return this.sources.find(source => {
			const resource = dereference(source)
			return (
				resource?.profile === KnownProfile.TableBundle ||
				resource?.profile === KnownProfile.DataTable
			)
		}) as TableEmitter | undefined
	}

	public override dispose(): void {
		this._input$.complete()
		this._output$.complete()
		super.dispose()
	}

	// #region Class Fields
	public override get name(): string {
		return super.name
	}

	public override set name(value: string) {
		super.name = value
		this._onChange.next()
	}

	// #endregion

	public get output$(): Observable<Maybe<TableContainer>> {
		return this._output$
	}

	public get output(): Maybe<TableContainer> {
		return this._output$.value
	}

	private renameTable = (
		table: Maybe<TableContainer>,
	): Maybe<TableContainer> => {
		return table == null ? table : { ...table, id: this.name }
	}

	private computeMeta = (
		table: Maybe<TableContainer>,
	): Maybe<TableContainer> => {
		if (!table?.table) {
			return table
		}
		return { ...table, metadata: introspect(table.table, true) }
	}
}
