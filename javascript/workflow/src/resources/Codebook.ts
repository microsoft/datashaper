/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Field } from '@datashaper/schema'
import { createCodebookSchemaObject } from '@datashaper/schema'

import { Resource } from './Resource.js'
import type { SchemaResource } from './types.js'

export class Codebook
	extends Resource
	implements SchemaResource<CodebookSchema>
{
	private _fields: Field[] = []

	public constructor(codebook?: CodebookSchema) {
		super()
		this.loadSchema(codebook)
	}

	public get fields(): Field[] {
		return this._fields
	}

	public set fields(value: Field[]) {
		this._fields = value
		this._onChange.next()
	}

	public override toSchema(): CodebookSchema {
		return createCodebookSchemaObject({
			...super.toSchema(),
			fields: this.fields,
		})
	}

	public override loadSchema(value: CodebookSchema | null | undefined) {
		super.loadSchema(value)
		this.fields = value?.fields ?? []
		this._onChange.next()
	}
}
