/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, ResourceSchema } from '@datashaper/schema'

import { dereference } from '../predicates.js'
import type { Maybe } from '../primitives.js'
import type { DataPackage } from './DataPackage/DataPackage.js'
import { Named } from './Named.js'
import type { ResourceReference } from './ResourceReference.js'
import type { Readable } from './types.js'

export abstract class Resource
	extends Named
	implements ResourceSchema, Resource
{
	/**
	 * Gets the resource schema
	 */
	public abstract get $schema(): string | undefined

	/**
	 * Gets the resource profile
	 */
	public abstract get profile(): Profile | undefined

	private _path: ResourceSchema['path']
	private _rel: ResourceSchema['rel']
	private _homepage: string | undefined
	private _license: string | undefined
	private _sources: (Resource | ResourceReference)[] = []

	public isReference(): boolean {
		return false
	}

	public get path(): ResourceSchema['path'] {
		return this._path
	}

	public set path(value: ResourceSchema['path']) {
		this._path = value
		this._onChange.next()
	}

	public get rel(): ResourceSchema['rel'] {
		return this._rel
	}

	public set rel(value: ResourceSchema['rel']) {
		this._rel = value
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

	public get sources(): (Resource | ResourceReference)[] {
		return this._sources
	}

	public set sources(value: (Resource | ResourceReference)[]) {
		this._sources = value
		this._onChange.next()
	}

	/**
	 * Connects this resource to the given data package
	 * @param dp - The data package to connect to
	 */
	public connect(_dp: DataPackage): void {
		/* do nothing, overridable */
	}

	/**
	 * Gets the sources of this resource that match the given profile type
	 * @param type - The profile type to filter by
	 * @returns The sources of this resource that match the given profile type
	 */
	public getSourcesWithProfile(type: Profile): Resource[] {
		return this.sources
			.map(dereference)
			.filter(s => s?.profile === type) as Resource[]
	}

	public override toSchema(): ResourceSchema {
		return {
			...super.toSchema(),
			$schema: this.$schema,
			profile: this.profile,
			path: this.path,
			rel: this.rel,
			homepage: this.homepage,
			license: this.license,
			sources: [],
			// sources: this.sources.map(s => s.toSchema()),
		}
	}

	public override loadSchema(
		value: Maybe<Readable<ResourceSchema>>,
		quiet = false,
	): void {
		super.loadSchema(value, true)
		this._path = value?.path
		this._homepage = value?.homepage
		this._license = value?.license
		this._rel = value?.rel
		this._sources = []

		if (!quiet) {
			this._onChange.next()
		}
	}
}
