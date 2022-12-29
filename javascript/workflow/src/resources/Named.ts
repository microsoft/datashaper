/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Named as NamedSchema } from '@datashaper/schema'

import type { Maybe } from '../primitives.js'
import { Observed } from './Observed.js'
import type { Readable } from './types.js'

export abstract class Named extends Observed implements NamedSchema {
	public defaultTitle(): string | undefined {
		return undefined
	}

	private _name = ''
	private _title: string | undefined = this.defaultTitle()
	private _description: string | undefined

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
			name: this.name,
			title: this.title,
			description: this.description,
		}
	}

	public loadSchema(schema: Maybe<Readable<NamedSchema>>, quiet = false): void {
		this._name = schema?.name ?? ''
		this._title = schema?.title ?? this.defaultTitle()
		this._description = schema?.description
		if (!quiet) {
			this._onChange.next()
		}
	}
}
