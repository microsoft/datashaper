/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	CodebookSchema,
	Field} from '@datashaper/schema';
import {
	createCodebookSchemaObject
} from '@datashaper/schema'
import { Subject } from 'rxjs'

import type { Unsubscribe } from '../primitives.js'
import type { ObservableResource, SchemaResource } from './types.js'

export class Codebook
	implements SchemaResource<CodebookSchema>, ObservableResource
{
	private _onChange: Subject<void> = new Subject<void>()
	private _fields: Field[] = []

	public constructor(codebook?: CodebookSchema) {
		this._fields = codebook?.fields ?? []
	}

	public get fields(): Field[] {
		return this._fields
	}

	public set fields(value: Field[]) {
		this._fields = value
		this._onChange.next()
	}

	public onChange(cb: () => void): Unsubscribe {
		const sub = this._onChange.subscribe(cb)
		return () => sub.unsubscribe()
	}

	public toSchema(): CodebookSchema {
		return createCodebookSchemaObject({
			fields: this.fields,
		})
	}

	public loadSchema(value: CodebookSchema | null | undefined) {
		this.fields = value?.fields ?? []
		this._onChange.next()
	}
}
