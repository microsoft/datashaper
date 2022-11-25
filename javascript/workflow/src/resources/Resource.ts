/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, ResourceSchema } from '@datashaper/schema'

import type { Maybe } from '../primitives.js'
import { Named } from './Named.js'

export abstract class Resource
	extends Named
	implements ResourceSchema, Resource
{
	/**
	 * Gets the resource schema
	 */
	public abstract get $schema(): string

	/**
	 * Gets the resource profile
	 */
	public abstract get profile(): Profile

	private _path: ResourceSchema['path']
	private _homepage: string | undefined
	private _license: string | undefined
	private _sources: Resource[] = []

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

	public get sources(): Resource[] {
		return this._sources
	}

	public set sources(value: Resource[]) {
		this._sources = value
		this._onChange.next()
	}

	public override toSchema(): ResourceSchema {
		return {
			...super.toSchema(),
			$schema: this.$schema,
			profile: this.profile,
			path: this.path,
			homepage: this.homepage,
			license: this.license,
			sources: this.sourcesToSchema() ?? [],
		}
	}

	/**
	 *
	 * @returns The serialized resources array
	 */
	protected sourcesToSchema(): Maybe<ResourceSchema[]> {
		// the default behavior is to not serialize sources.
		// this is because data bundles usually write these into the blob archive, which is not available here.
		// if you want to serialize sources, override this method.
		return undefined
	}

	public override loadSchema(
		value: Maybe<ResourceSchema>,
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
