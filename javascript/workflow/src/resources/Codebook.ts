/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Field } from '@datashaper/schema'
import {
	createCodebookSchemaObject,
	LATEST_CODEBOOK_SCHEMA,
} from '@datashaper/schema'

import { Resource } from './Resource.js'
import type { SchemaResource } from './types.js'

export class Codebook
	extends Resource
	implements SchemaResource<CodebookSchema>
{
	public readonly $schema = LATEST_CODEBOOK_SCHEMA
	private _fields: Field[] = []
	private _initPromise: Promise<void>

	public constructor(codebook?: CodebookSchema) {
		super()
		this._initPromise = this.loadSchema(codebook)
	}

	public initialize(): Promise<void> {
		return this._initPromise
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

	public override async loadSchema(
		value: CodebookSchema | null | undefined,
		resources?: Map<string, Blob>,
		quiet?: boolean,
	): Promise<void> {
		await super.loadSchema(value, resources, true)
		this.fields = value?.fields ?? []
		if (!quiet) {
			this._onChange.next()
		}
	}
}
