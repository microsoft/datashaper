/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CodebookSchema, CodebookStrategy, Field } from '@datashaper/schema'
import {
	createCodebookSchemaObject,
	KnownProfile,
	LATEST_CODEBOOK_SCHEMA,
} from '@datashaper/schema'
import { type TableContainer, applyCodebook } from '@datashaper/tables'
import { type Observable, BehaviorSubject, Subscription } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Resource } from './Resource.js'
import type { TableTransformer } from './types.js'

export class Codebook extends Resource implements TableTransformer {
	public readonly $schema = LATEST_CODEBOOK_SCHEMA
	public readonly profile = KnownProfile.Codebook
	private readonly _output$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private _inputSub: Subscription | undefined

	public override defaultTitle(): string {
		return 'codebook.json'
	}

	private _fields$ = new BehaviorSubject<Field[]>([])

	public constructor(codebook?: CodebookSchema) {
		super()
		this.loadSchema(codebook)
	}

	public set input$(value: Observable<Maybe<TableContainer>>) {
		this._inputSub?.unsubscribe()
		this._inputSub = value.subscribe(table =>
			this._output$.next(this.encodeTable(table)),
		)
	}

	public get output$(): Observable<Maybe<TableContainer>> {
		return this._output$
	}

	public get output(): Maybe<TableContainer> {
		return this._output$.value
	}

	public get fields$(): Observable<Field[]> {
		return this._fields$
	}

	public get fields(): Field[] {
		return this._fields$.value
	}

	public set fields(value: Field[]) {
		this._fields$.next(value)
		this._onChange.next()
	}

	public override toSchema(): CodebookSchema {
		return createCodebookSchemaObject({
			...super.toSchema(),
			fields: this.fields,
		})
	}

	public override loadSchema(
		value: Maybe<CodebookSchema>,
		quiet?: boolean,
	): void {
		super.loadSchema(value, true)
		this.fields = value?.fields ?? []
		if (!quiet) {
			this._onChange.next()
		}
	}

	public override dispose(): void {
		this._fields$.complete()
		super.dispose()
	}

	private encodeTable = (t: Maybe<TableContainer>): Maybe<TableContainer> => {
		if (t?.table == null || this.fields.length === 0) {
			return t
		}

		const encodedTable = applyCodebook(
			t.table,
			this,
			CodebookStrategy.DataTypeAndMapping,
		)
		return { ...t, table: encodedTable }
	}
}
