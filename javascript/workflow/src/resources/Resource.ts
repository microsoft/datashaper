/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'

import type { Maybe } from '../primitives.js'
import { Named } from './Named.js'
import type { SchemaResource } from './types.js'

export class Resource
	extends Named
	implements
		Omit<ResourceSchema, '$schema' | 'profile'>,
		SchemaResource<Omit<ResourceSchema, '$schema' | 'profile' | 'sources'>>
{
	private _path: ResourceSchema['path']
	private _homepage: string | undefined
	private _license: string | undefined

	public get path(): ResourceSchema['path'] {
		return this._path
	}

	public set path(value: ResourceSchema['path']) {
		this._path = value
		this._onChange.next()
	}

	public get homepage(): string | undefined {
		return this._homepage
	}

	public set homepage(value: string | undefined) {
		this._homepage = value
		this._onChange.next()
	}

	public get license(): string | undefined {
		return this._license
	}

	public set license(value: string | undefined) {
		this._license = value
		this._onChange.next()
	}

	public override toSchema(): Omit<ResourceSchema, '$schema' | 'profile'> {
		return {
			...super.toSchema(),
			path: this.path,
			homepage: this.homepage,
			license: this.license,
		}
	}

	public override loadSchema(
		value: Maybe<Omit<ResourceSchema, '$schema' | 'profile'>>,
		quiet = false,
	): void {
		super.loadSchema(value, true)
		this._path = value?.path
		this._homepage = value?.homepage
		this._license = value?.license
		if (!quiet) {
			this._onChange.next()
		}
	}
}
