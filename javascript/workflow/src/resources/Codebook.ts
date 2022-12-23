/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Field } from '@datashaper/schema'
import {
	createCodebookSchemaObject,
	KnownProfile,
	LATEST_CODEBOOK_SCHEMA,
} from '@datashaper/schema'
import { type Observable, BehaviorSubject } from 'rxjs'

import type { Maybe } from '../primitives.js'
import { Resource } from './Resource.js'

export class Codebook extends Resource {
	public readonly $schema = LATEST_CODEBOOK_SCHEMA
	public readonly profile = KnownProfile.Codebook

	public override defaultTitle(): string {
		return 'codebook.json'
	}

	private _fields$ = new BehaviorSubject<Field[]>([])

	public constructor(codebook?: CodebookSchema) {
		super()
		this.loadSchema(codebook)
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
}
