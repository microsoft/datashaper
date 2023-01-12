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
import {
	extension as ext,
	removeExtension as rmExt,
} from '@datashaper/utilities'
import type { Observable } from 'rxjs'

import { Resource } from '../Resource.js'
import type { ProfileHandler } from '../types.js'
import { write } from './io.js'
import { CodebookProfile } from './profiles/CodebookProfile.js'
import { DataTableProfile } from './profiles/DataTableProfile.js'
import { TableBundleProfile } from './profiles/TableBundleProfile.js'
import { WorkflowProfile } from './profiles/WorkflowProfile.js'
import { ResourceManager } from './ResourceManager.js'

export class DataPackage extends Resource {
	public readonly $schema = LATEST_DATAPACKAGE_SCHEMA
	public readonly profile = KnownProfile.DataPackage
	private _resourceMgr: ResourceManager = new ResourceManager()

	public constructor() {
		super()
		const profiles = [
			new TableBundleProfile(),
			new DataTableProfile(),
			new CodebookProfile(),
			new WorkflowProfile(),
		] as ProfileHandler[]
		profiles.forEach(p => {
			p.initialize?.({ dataPackage: this })
			this._resourceMgr.registerProfile(p)
		})
	}

	public override defaultTitle(): string {
		return 'datapackage.json'
	}

	public get resourceManager(): ResourceManager {
		return this._resourceMgr
	}

	public get resources(): Resource[] {
		return this._resourceMgr.topResources
	}

	public get resources$(): Observable<Resource[]> {
		return this._resourceMgr.topResources$
	}

	public get size(): number {
		return this._resourceMgr.topSize
	}

	public get size$(): Observable<number> {
		return this._resourceMgr.topSize$
	}

	public get names(): string[] {
		return this._resourceMgr.topNames
	}

	public get names$(): Observable<string[]> {
		return this._resourceMgr.topNames$
	}

	public get isEmpty(): boolean {
		return this._resourceMgr.topIsEmpty
	}

	public get isEmpty$(): Observable<boolean> {
		return this._resourceMgr.topIsEmpty$
	}

	public addResource(resource: Resource, top = true): void {
		this.checkResourceName(resource)
		if (!resource.isConnected) {
			resource.connect(this)
		}
		this._resourceMgr.addResource(resource, top)
		this._onChange.next()
	}

	/**
	 * Suggests a new, unique resource name for a resource to adopt
	 * @param name - The seed name
	 * @returns A unique name based on the seed name for the resource to adopt
	 */
	public suggestResourceName(name: string): string {
		const hasExtension = name.indexOf('.') >= 0
		const extension = hasExtension ? ext(name) : undefined
		const baseName = hasExtension ? rmExt(name) : name

		let nameIdx = 1
		while (this._resourceMgr.hasResource(name)) {
			name = `${baseName} (${nameIdx++})${hasExtension ? `.${extension}` : ''}`
		}
		return name
	}

	private checkResourceName(resource: Resource): void {
		const existingResourceWithName = this._resourceMgr.getResource(
			resource.name,
		)
		if (existingResourceWithName && existingResourceWithName !== resource) {
			resource.title = resource.name
			resource.name = this.suggestResourceName(resource.name)
		}
	}

	public removeResource(name: string): void {
		this._resourceMgr.removeResource(name)
		this._onChange.next()
	}

	public getResource(name: string): Resource | undefined {
		return this.resources.find(t => t.name === name)
	}

	public clear(): void {
		this._resourceMgr.clear()
		this._onChange.next()
	}

	/**
	 * Registers a new handler for processing resources.
	 *
	 * @param handler - the resource handler
	 */
	public addResourceHandler(handler: ProfileHandler): void {
		this._resourceMgr.registerProfile(handler)
	}

	public override loadSchema(): void {
		throw new Error('not implemented')
	}

	public override toSchema(): DataPackageSchema {
		return createDataPackageSchemaObject({
			...super.toSchema(),
			resources: this.resources.map(t => t.toSchema()),
		})
	}

	public async save(): Promise<Map<string, Blob>> {
		const files = new Map<string, Blob>()
		const resources = await this._resourceMgr.save(files)
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
		const schema = await this._resourceMgr.load(files)
		super.loadSchema(schema)
		this._resourceMgr.topResources.forEach(t => t.connect(this))
		if (!quiet) {
			this._onChange.next()
		}
	}
}
