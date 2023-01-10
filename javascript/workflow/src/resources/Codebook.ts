/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Field } from '@datashaper/schema'
import {
	CodebookStrategy,
	createCodebookSchemaObject,
	KnownProfile,
	LATEST_CODEBOOK_SCHEMA,
} from '@datashaper/schema'
import {
	type TableContainer,
	applyCodebook,
	generateCodebook,
} from '@datashaper/tables'
import type { Subscription } from 'rxjs'
import { type Observable, BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Resource } from './Resource.js'
import type { Readable, TableTransformer } from './types.js'

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
	public override defaultName(): string {
		return 'codebook.json'
	}

	private _fields$ = new BehaviorSubject<Field[]>([])

	public constructor(codebook?: Readable<CodebookSchema>) {
		super()
		this.loadSchema(codebook)
	}

	public set input$(value: Maybe<Observable<Maybe<TableContainer>>>) {
		this._inputSub?.unsubscribe()
		this._inputSub = value?.subscribe(table =>
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
		value: Maybe<Readable<CodebookSchema>>,
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
		if (t?.table == null) {
			// empty table? just return it
			return t
		} else if (this.fields.length === 0) {
			// valid table but empty codebook? generate a new codebook
			this._fields$.next(generateCodebook(t.table).fields)
		}

		if (this.fields.length === 0) {
			// no codebook at this point? just return the table
			return t
		}

		// apply the codebook to the table
		const encodedTable = applyCodebook(
			t.table,
			this,
			CodebookStrategy.DataTypeAndMapping,
		)
		return { ...t, table: encodedTable }
	}
}
