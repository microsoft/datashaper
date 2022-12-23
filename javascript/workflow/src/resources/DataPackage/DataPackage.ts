/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type { DataPackageSchema } from '@datashaper/schema'
import {
	createDataPackageSchemaObject,
	KnownProfile,
	LATEST_DATAPACKAGE_SCHEMA,
} from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'

import { Resource } from '../Resource.js'
import type { ResourceHandler } from '../types.js'
import { TableBundleHandler } from './handlers/TableBundleHandler.js'
import { write } from './io.js'
import { ResourceManager } from './ResourceManager.js'

export class DataPackage extends Resource {
	public readonly $schema = LATEST_DATAPACKAGE_SCHEMA
	public readonly profile = KnownProfile.DataPackage

	public override defaultTitle(): string {
		return 'datapackage.json'
	}

	/**
	 * A map of profile-name to resource hnadler
	 */
	private _resourceDisposables: Map<string, () => void> = new Map()
	private _resources$ = new BehaviorSubject<Resource[]>([])
	private _names$ = this._resources$.pipe(map(r => r.map(t => t.name)))
	private _size$ = this._resources$.pipe(map(r => r.length))
	private _isEmpty$ = this._size$.pipe(map(n => n === 0))
	private _resourceManager: ResourceManager = new ResourceManager()

	public constructor(public dataPackage?: DataPackageSchema) {
		super()
		const tableBundleHandler = new TableBundleHandler()
		this.addResourceHandler(tableBundleHandler)
		this.loadSchema(dataPackage)
	}

	public get resources(): Resource[] {
		return this._resources$.value
	}

	public get resources$(): Observable<Resource[]> {
		return this._resources$
	}

	public get size(): number {
		return this.resources.length
	}

	public get size$(): Observable<number> {
		return this._size$
	}

	public get names(): string[] {
		return this.resources.map(r => r.name).filter(t => !!t) as string[]
	}

	public get names$(): Observable<string[]> {
		return this._names$
	}

	public get isEmpty(): boolean {
		return this.size === 0
	}

	public get isEmpty$(): Observable<boolean> {
		return this._isEmpty$
	}

	public addResource(resource: Resource): void {
		this._resources$.next([...this.resources, resource])
		this._resourceDisposables.set(
			resource.name,
			resource.onChange(() => this._resources$.next(this.resources)),
		)
		resource.onDispose(() => this.removeResource(resource.name))
		this._onChange.next()
	}

	public suggestResourceName(name: string): string {
		const baseName = name
		let nameIdx = 1
		while (this.names.includes(name)) {
			name = `${baseName} (${nameIdx++})`
		}
		return name
	}

	public removeResource(name: string): void {
		this._resourceDisposables.get(name)?.()
		this._resources$.next(this.resources.filter(t => name !== t.name))
		this._onChange.next()
	}

	public getResource(name: string): Resource | undefined {
		return this.resources.find(t => t.name === name)
	}

	public clear(): void {
		this._resourceDisposables.forEach(d => d())
		this._resourceDisposables.clear()
		this._resources$.next([])
		this._resourceManager.clear()
		this._onChange.next()
	}

	/**
	 * Registers a new handler for processing resources.
	 *
	 * @param handler - the resource handler
	 */
	public addResourceHandler(handler: ResourceHandler): void {
		handler.connect?.(this)
		this._resourceHandlers.set(handler.profile, handler)
	}

	public override toSchema(): DataPackageSchema {
		return createDataPackageSchemaObject({
			...super.toSchema(),
			resources: this.resources.map(t => t.toSchema()),
		})
	}

	public async save(): Promise<Map<string, Blob>> {
		const resources: string[] = []
		const files = new Map<string, Blob>()

		for (const resource of this.resources) {
			const handler = this._resourceHandlers.get(resource.profile)
			if (handler) {
				resources.push(...(await handler.save(resource, files)))
			} else {
				throw new Error(
					`no handler defined for resource profile: ${resource.profile}`,
				)
			}
		}

		files.set('datapackage.json', write(this, { resources }))
		return files
	}

	/**
	 * Load the data-package from an archive of files, usually hydrated from a zip.
	 *
	 * The load process occurs in stages.
	 *
	 * In the first stage, the datapackage.json file is loaded and recursed to
	 * create a hierarchy of objects that represent the resource tree.
	 *
	 * In the second stage, we walk the resource tree and link together resources that
	 * have cross-references.
	 *
	 * @param files - The files in the archive
	 * @param quiet - If true, will not emit an onChange event
	 */
	public async load(files: Map<string, Blob>, quiet?: boolean): Promise<void> {
		const schema = await this._resourceManager.load(files)
		this.loadSchema(schema)
		if (!quiet) {
			this._onChange.next()
		}
	}
}
