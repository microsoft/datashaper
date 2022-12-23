/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	DataPackageSchema,
	Profile,
	ResourceSchema,
} from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'
import type { Observable } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'

import type { Resource } from '../Resource.js'
import { ResourceReference } from '../ResourceReference.js'
import type { ProfileHandler } from '../types.js'
import { CodebookProfile } from './profiles/CodebookProfile.js'
import { DataTableProfile } from './profiles/DataTableProfile.js'
import { TableBundleProfile } from './profiles/TableBundleProfile.js'
import { WorkflowProfile } from './profiles/WorkflowProfile.js'

export class ResourceManager {
	private _resourceByName: Map<string, Resource> = new Map()
	// TODO: this is really only a load-time concern.
	// we should probably move it to a new loader class
	private _resourceByPath = new Map<string, Resource>()
	private _files: Map<string, Blob> = new Map()
	private _resourceDisposables: Map<string, () => void> = new Map()

	private _topResources$ = new BehaviorSubject<Resource[]>([])
	private _topNames$ = this._topResources$.pipe(map(r => r.map(r => r.name)))
	private _topSize$ = this._topResources$.pipe(map(r => r.length))
	private _topIsEmpty$ = this._topResources$.pipe(map(r => r.length === 0))

	private _resources$ = new BehaviorSubject<Resource[]>([])
	private _names$ = this._resources$.pipe(map(r => r.map(r => r.name)))
	private _size$ = this._resources$.pipe(map(r => r.length))
	private _isEmpty$ = this._resources$.pipe(map(r => r.length === 0))

	private _profileHandlers: Map<Profile, ProfileHandler> = new Map([
		[KnownProfile.TableBundle, new TableBundleProfile()],
		[KnownProfile.DataTable, new DataTableProfile()],
		[KnownProfile.Codebook, new CodebookProfile()],
		[KnownProfile.Workflow, new WorkflowProfile()],
	] as [Profile, ProfileHandler][])

	/**
	 * The top-level resources observable
	 */
	public get topResources$(): Observable<Resource[]> {
		return this._topResources$
	}

	/**
	 * The top level resources
	 */
	public get topResources(): Resource[] {
		return this._topResources$.value
	}

	/**
	 * The top-level resource names observable
	 */
	public get topNames$(): Observable<string[]> {
		return this._topNames$
	}

	/**
	 * The top-level resource names
	 */
	public get topNames(): string[] {
		return this.topResources.map(r => r.name)
	}

	/**
	 * The top-level resource count
	 */
	public get topSize$(): Observable<number> {
		return this._topSize$
	}

	/**
	 * The top-level resource count
	 */
	public get topSize(): number {
		return this.topResources.length
	}

	/**
	 * Is the resource manager empty of resources - observable
	 */
	public get topIsEmpty$(): Observable<boolean> {
		return this._topIsEmpty$
	}

	/**
	 * Is the resource manager empty of resources
	 */
	public get topIsEmpty(): boolean {
		return this.size === 0
	}

	/**
	 * All resources observable
	 */
	public get resources$(): Observable<Resource[]> {
		return this._resources$
	}

	/**
	 * All resources
	 */
	public get resources(): Resource[] {
		return this._resources$.value
	}

	/**
	 * All resource names observable
	 */
	public get names$(): Observable<string[]> {
		return this._names$
	}

	/**
	 * The count of all resources observable
	 */
	public get size$(): Observable<number> {
		return this._size$
	}

	/**
	 * The count of all resources
	 */
	public get size(): number {
		return this.resources.length
	}

	/**
	 * Is the resource manager empty of resources - observable
	 */
	public get isEmpty$(): Observable<boolean> {
		return this._isEmpty$
	}

	/**
	 * Is the resource manager empty of resources
	 */
	public get isEmpty(): boolean {
		return this.size === 0
	}

	/**
	 * Reads a raw resource blob from the loaded archive
	 * @param path - The path to the resource
	 * @returns The raw blob of the read resource
	 */
	public readFile(path: string): Blob | undefined {
		return this._files.get(path)
	}

	/**
	 * Adds a new resource to track
	 * @param resource - The resource to add
	 */
	public addResource(resource: Resource, top: boolean): void {
		let name = resource.name
		this.registerResource(resource)
		this._resourceByName.set(name, resource)
		this._resources$.next([...this.resources, resource])
		if (top) {
			this._topResources$.next([...this.topResources, resource])
		}

		// re-file the resource by name when the resource changes
		this._resourceDisposables.set(
			resource.name,
			resource.onChange(() => {
				this._resourceByName.delete(name)
				this.registerResource(resource)
				name = resource.name
				this._resources$.next(this.resources)
			}),
		)
		resource.onDispose(() => this.removeResource(resource.name))
	}

	/**
	 * Removes a resource from the resource management system
	 * @param name - The name of the resource to remove
	 */
	public removeResource(name: string): void {
		this._resourceDisposables.get(name)?.()
		this._resourceDisposables.delete(name)
		this._resources$.next(this.resources.filter(t => name !== t.name))
		this._topResources$.next(this.topResources.filter(t => name !== t.name))
	}

	/**
	 * Determines if a resource exists by name
	 * @param name - the name of the resource to check
	 * @returns Whether the resource exists
	 */
	public hasResource(name: string): boolean {
		return this._resourceByName.has(name)
	}

	/**
	 * Gets a resource by name
	 * @param name - the name of the resource to get
	 * @returns The resource or undefined if not found
	 */
	public getResource(name: string): Resource | undefined {
		return this._resourceByName.get(name)
	}

	/**
	 * Gets a resource by path
	 * @param path - the path of the resource to get
	 * @returns The resource or undefined if not found
	 */
	public getResourceByPath(path: string): Resource | undefined {
		return this._resourceByPath.get(path)
	}

	/**
	 * Register a new profile handle with the resource management system
	 *
	 * @param handler - The profile handler to register
	 */
	public registerProfile(handler: ProfileHandler): void {
		if (this._profileHandlers.has(handler.profile)) {
			console.warn(
				`A resource handler for profile '${handler.profile}' is already registered. Overriding existing entry.`,
			)
		}
		this._profileHandlers.set(handler.profile, handler)
	}

	/**
	 * Clear out the resource manager. The resources and filesystem will be cleared.
	 */
	public clear(): void {
		this._files.clear()
		this._resources$.next([])
		this._resourceByName.clear()
	}

	/**
	 * Resets the resource manager to a new set of files
	 *
	 * @param files - the archive to reset fromw
	 * @returns The loaded datapackage schema
	 */
	public async load(files: Map<string, Blob>): Promise<DataPackageSchema> {
		const resolveResource = (
			entry: string | ResourceSchema,
		): Resource | undefined => {
			const isRef = this.isReference(entry)
			// if entry is a string, it's likely a path, otherwise check for a name
			let key = typeof entry === 'string' ? entry : entry.name
			if (isRef) {
				key = entry.path
			}
			const resource = this.getResource(key) || this.getResourceByPath(key)

			if (isRef) {
				const reference = new ResourceReference()
				reference.target = resource
				reference.rel = entry.rel
				return reference
			} else {
				return resource
			}
		}

		this.clear()
		this._files = files

		const dataPackage = await this.getDataPackageSchema()
		/**
		 * Step 1: Read all Schemas
		 */
		const schemas: { schema: ResourceSchema; path: string }[] =
			await this.readSchemas(dataPackage)

		/**
		 * Step 2: Reify Instances
		 */
		const nonReferenceSchemas = schemas.filter(s => !this.isReference(s.schema))
		const resources = await this.reifySchemas(nonReferenceSchemas)

		/**
		 * Step 3: Track resources by name and path
		 */
		for (const { resource, path } of resources) {
			this.registerResource(resource)
			this._resourceByPath.set(path, resource)
		}

		/**
		 * Step 4: Link Resources and Resolve References
		 */
		for (const { resource, schema } of resources) {
			const sources = (schema.sources?.map(resolveResource).filter(t => !!t) ??
				[]) as Resource[]

			resource.sources = sources
		}

		const topLevelResources = dataPackage.resources
			.map(resolveResource)
			.filter(t => !!t) as Resource[]

		this._resources$.next(resources.map(r => r.resource))
		this._topResources$.next(topLevelResources)
		return dataPackage
	}

	private async readSchemas(
		dataPackage: DataPackageSchema,
	): Promise<{ schema: ResourceSchema; path: string }[]> {
		const nameToPath = new Map<string, string>()

		// Determine the name of a resource, try to not collide if possible
		const resourceName = (res: ResourceSchema) => {
			if (res.name) {
				return res.name
			} else {
				const profile = res.profile || 'resource'
				let candidate = `${profile}.json`
				let index = 0
				while (nameToPath.has(candidate)) {
					candidate = `${profile}-${++index}.json`
				}
				return candidate
			}
		}

		// Resolve a schema entry to a schema object
		const resolveSchema = async (
			entry: string | ResourceSchema,
		): Promise<ResourceSchema | undefined> => {
			if (this.isReference(entry)) {
				entry = entry.path
			} else if (typeof entry !== 'string') {
				return entry
			}

			if (nameToPath.has(entry)) {
				// this is a duplicate, return undefined
				return undefined
			}
			return this.readResource(entry)
		}

		const resolvePath = (
			entry: string | ResourceSchema,
			schema: ResourceSchema,
			parentPath: string,
		) => {
			if (this.isReference(entry)) {
				return entry.path
			}
			return typeof entry === 'string'
				? entry
				: `${parentPath}${resourceName(schema)}`
		}

		const readEntry = async (
			entry: string | ResourceSchema,
			parentPath: string,
		): Promise<{ schema: ResourceSchema; path: string } | undefined> => {
			const schema = await resolveSchema(entry)
			if (!schema) {
				return undefined
			}
			schema.name = schema.name || resourceName(schema)
			const path = resolvePath(entry, schema, parentPath)

			if (nameToPath.has(schema.name)) {
				const existingPath = nameToPath.get(schema.name)
				if (existingPath !== path) {
					throw new Error(
						`duplicate resource name ${schema.name} found in two different paths: ${existingPath} and ${path}`,
					)
				}
				return undefined
			}
			nameToPath.set(schema.name, path)
			return { schema, path }
		}

		const readEntries = async (
			entries: (ResourceSchema | string)[],
			parentPath = '',
		): Promise<Array<{ schema: ResourceSchema; path: string }>> => {
			const result = await Promise.all(
				entries.map(e => readEntry(e, parentPath)),
			)
			return result.filter(t => !!t) as Array<{
				schema: ResourceSchema
				path: string
			}>
		}

		// Read the top-level schemas
		const schemas = await readEntries(dataPackage.resources)

		// Read all children scemas
		for (let i = 0; i < schemas.length; i++) {
			const { schema, path } = schemas[i]!
			const sources = schema.sources ?? []
			schemas.push(...(await readEntries(sources, `${path}/`)))
		}

		return schemas
	}

	private reifySchemas(
		schemas: Array<{ schema: ResourceSchema; path: string }>,
	): Promise<
		Array<{ path: string; resource: Resource; schema: ResourceSchema }>
	> {
		return Promise.all(
			schemas.map(({ schema, path }) => {
				// override sources so that we can link them together in a second pass
				return this.constructResource({ ...schema, sources: [] }).then(
					resource => ({
						resource,
						schema,
						path,
					}),
				)
			}),
		)
	}

	private async readResource(entry: string): Promise<ResourceSchema> {
		// if the item is a string, look up the resource in the files map
		let result: ResourceSchema | undefined

		const blob = this._files.get(entry)
		const resourceText = await blob?.text()
		if (resourceText != null) {
			try {
				result = JSON.parse(resourceText) as ResourceSchema
			} catch (e) {
				console.error(`error parsing resource ${entry}`, e)
			}
		}
		if (result == null) {
			throw new Error(`could not resolve resource "${entry}"`)
		}
		return result
	}

	private async constructResource(schema: ResourceSchema): Promise<Resource> {
		let result: Resource | undefined
		if (schema.profile == null) {
			throw new Error('schema has no profile')
		}
		const handler = this._profileHandlers.get(schema.profile)
		if (handler != null) {
			result = await handler.createInstance(schema, this)
		}
		if (result == null) {
			throw new Error(
				`could not construct resource with profile "${schema.profile}", are you missing a resource handler?"`,
			)
		}
		return result
	}

	private registerResource(resource: Resource) {
		if (this._resourceByName.has(resource.name)) {
			throw new Error(`duplicate resource name: ${resource.name}`)
		}
		this._resourceByName.set(resource.name, resource)
	}

	private async getDataPackageSchema(): Promise<DataPackageSchema> {
		const dataPackageBlob = this._files.get('datapackage.json')
		if (dataPackageBlob == null) {
			throw new Error('file archive must contain datapackage.json')
		}
		return JSON.parse(await dataPackageBlob.text()) as DataPackageSchema
	}

	private isReference(
		entry: ResourceSchema | string,
	): entry is ResourceSchema & { path: string } {
		return (
			typeof entry !== 'string' &&
			entry.profile == null &&
			entry.path != null &&
			typeof entry.path === 'string'
		)
	}
}
