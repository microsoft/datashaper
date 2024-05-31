/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, ResourceSchema } from '@datashaper/schema'

import { dereference } from '../predicates.js'
import type { Maybe, Unsubscribe } from '../primitives.js'
import type { DataPackage } from './DataPackage/DataPackage.js'
import { Named } from './Named.js'
import type { ResourceReference } from './ResourceReference.js'
import type { Readable } from './types/index.js'

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

	public override defaultName(): string {
		return this.profile ?? 'resource'
	}

	private _path: ResourceSchema['path']
	private _rel: ResourceSchema['rel']
	private _homepage: string | undefined
	private _license: string | undefined
	private _sources: (Resource | ResourceReference)[] = []
	private _dataPackage: DataPackage | undefined
	private _unlistenToSources: Unsubscribe | undefined

	protected get dataPackage(): DataPackage | undefined {
		return this._dataPackage
	}

	protected set dataPackage(value: DataPackage | undefined) {
		this._dataPackage = value
	}

	public isReference(): this is ResourceReference {
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
		const dp = this._dataPackage
		this._unlistenToSources?.()

		this._sources = value
		if (dp != null) {
			this._sources.forEach((s) => s.connect(dp, false))
		}

		// Listen to source changes and bubble up onchange events
		const handlers = this._sources.map((v) =>
			v.onChange(() => this._onChange.next()),
		)
		this._unlistenToSources = () => handlers.forEach((h) => h())
		this._onChange.next()
	}

	public get isConnected(): boolean {
		return this._dataPackage != null
	}

	/**
	 * Connects this resource to the given data package
	 * @param dp - The data package to connect to
	 */
	public connect(dp: DataPackage, top = true): void {
		this._dataPackage = dp
		dp.addResource(this, top)
		this._sources
			.filter((s) => !s.isReference())
			.forEach((s) => s.connect(dp, false))
	}

	/**
	 * Gets the sources of this resource that match the given profile type
	 * @param type - The profile type to filter by
	 * @returns The sources of this resource that match the given profile type
	 */
	public getSourcesWithProfile(type: Profile): Resource[] {
		return this.sources
			.map(dereference)
			.filter((s) => s?.profile === type) as Resource[]
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
		// this._sources = []

		if (!quiet) {
			this._onChange.next()
		}
	}

	public override dispose(): void {
		super.dispose()
		this._sources.forEach((s) => s.dispose())
		this._dataPackage = undefined
	}
}
