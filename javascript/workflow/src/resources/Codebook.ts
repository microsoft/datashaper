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
import { type TableContainer, applyCodebook } from '@datashaper/tables'
import type { Subscription } from 'rxjs'
import { type Observable, BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Resource } from './Resource.js'
import type { Readable, TableTransformer } from './types/index.js'

export class Codebook extends Resource implements TableTransformer {
	public readonly $schema = LATEST_CODEBOOK_SCHEMA
	public readonly profile = KnownProfile.Codebook

	public override defaultTitle(): string {
		return 'codebook'
	}
	public override defaultName(): string {
		return 'codebook.json'
	}

	private readonly _output$ = new BehaviorSubject<Maybe<TableContainer>>(
		undefined,
	)
	private _inputSub: Subscription | undefined
	private _input: Maybe<TableContainer>
	private _fields$ = new BehaviorSubject<Field[]>([])

	public constructor(codebook?: Readable<CodebookSchema>) {
		super()
		this.loadSchema(codebook)
	}

	public set input$(value: Maybe<Observable<Maybe<TableContainer>>>) {
		this._inputSub?.unsubscribe()
		this._inputSub = value?.subscribe((table) => {
			this._input = table
			this.recomputeOutput()
		})
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
		this.recomputeOutput()
	}

	private recomputeOutput = (): void => {
		if (this._input?.table != null && this.fields.length > 0) {
			const encodedTable = applyCodebook(
				this._input?.table,
				this,
				CodebookStrategy.DataTypeAndMapping,
			)
			this._output$.next({ ...this._input, table: encodedTable })
		} else {
			this._output$.next(this._input)
		}
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
}
