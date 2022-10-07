/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Named as NamedSchema } from '@datashaper/schema'
import { v4 } from 'uuid'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'
import type { SchemaResource } from './types.js'

export class Named
	extends Observed
	implements
		Omit<NamedSchema, 'profile' | '$schema'>,
		SchemaResource<NamedSchema>
{
	private _id: string = v4()
	private _name = ''
	private _title: string | undefined
	private _description: string | undefined

	public get id(): string {
		return this._id
	}

	public set id(value: string) {
		this._id = value
		this._onChange.next()
	}

	public get name(): string {
		return this._name
	}

	public set name(value: string) {
		this._name = value
		this._onChange.next()
	}

	public get title(): string | undefined {
		return this._title
	}

	public set title(value: string | undefined) {
		this._title = value
		this._onChange.next()
	}

	public get description(): string | undefined {
		return this._description
	}

	public set description(value: string | undefined) {
		this._description = value
		this._onChange.next()
	}

	public toSchema(): NamedSchema {
		return {
			id: this.id,
			name: this.name,
			title: this.title,
			description: this.description,
		}
	}

	public loadSchema(schema: Maybe<NamedSchema>, quiet = false): void {
		this._id = schema?.id ?? v4()
		this._name = schema?.name ?? ''
		this._title = schema?.title
		this._description = schema?.description
		if (!quiet) {
			this._onChange.next()
		}
	}
}
