/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	DataPackageSchema,
	Profile,
	ResourceSchema} from '@datashaper/schema';
import {
	KnownProfile
} from '@datashaper/schema'
import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs'

import { Codebook } from '../Codebook.js'
import { DataTable } from '../DataTable.js'
import type { Resource } from '../Resource.js'
import { TableBundle } from '../TableBundle.js'
import { Workflow } from '../Workflow/Workflow.js'
import type { ProfileHandler } from './types.js'

export class ResourceManager {
	private _resourceByName: Map<string, Resource> = new Map()
	private _resourceByPath: Map<string, Resource> = new Map()
	private _files: Map<string, Blob> = new Map()

	private _resourceDisposables: Map<string, () => void> = new Map()
	private _topLevelResources$ = new BehaviorSubject<Resource[]>([])

	private _resourceHandlers: Map<Profile, ProfileHandler> = new Map([
		[
			KnownProfile.TableBundle,
			{ profile: KnownProfile.TableBundle, constructor: TableBundle },
		],
		[
			KnownProfile.DataTable,
			{ profile: KnownProfile.DataTable, constructor: DataTable },
		],
		[
			KnownProfile.Codebook,
			{ profile: KnownProfile.Codebook, constructor: Codebook },
		],
		[
			KnownProfile.Workflow,
			{ profile: KnownProfile.Workflow, constructor: Workflow },
		],
	] as [Profile, ProfileHandler][])

	public get topLevelResources(): Resource[] {
		return this._topLevelResources$.value
	}

	public get topLevelResources$(): Observable<Resource[]> {
		return this._topLevelResources$
	}

	public get totalResourceCount(): number {
		return this._resourceByName.size
	}

	public get resourceNames(): string[] {
		return Array.from(this._resourceByName.keys())
	}

	public getResourceByName(name: string): Resource | undefined {
		return this._resourceByName.get(name)
	}

	public getResourceByPath(path: string): Resource | undefined {
		return this._resourceByPath.get(path)
	}

	/**
	 * Register a new profile handle with the resource management system
	 *
	 * @param handler - The profile handler to register
	 */
	public registerProfile(handler: ProfileHandler): void {
		if (this._resourceHandlers.has(handler.profile)) {
			console.warn(
				`A resource handler for profile '${handler.profile}' is already registered. Overriding existing entry.`,
			)
		}
		this._resourceHandlers.set(handler.profile, handler)
	}

	/**
	 * Clear out the resource manager. The resources and filesystem will be cleared.
	 */
	public clear(): void {
		this._files.clear()
		this._topLevelResources$.next([])
		this._resourceByName.clear()
	}

	/**
	 * Resets the resource manager to a new set of files
	 *
	 * @param files - the archive to reset fromw
	 * @returns The loaded datapackage schema
	 */
	public async load(files: Map<string, Blob>): Promise<DataPackageSchema> {
		try {
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
			const nonReferenceSchemas = schemas.filter(
				s => !this.isReference(s.schema),
			)
			const resources = this.reifySchemas(nonReferenceSchemas)

			/**
			 * Step 3: Track resources by name and path
			 */
			for (const { resource, path } of resources) {
				if (this._resourceByName.has(resource.name)) {
					throw new Error(`duplicate resource name: ${resource.name}`)
				}
				this._resourceByName.set(resource.name, resource)
				this._resourceByPath.set(path, resource)
			}

			/**
			 * Step 4: Link Resources and Resolve References
			 */
			for (const { resource, schema } of resources) {
				const sources = (schema.sources
					?.map(this.resolveResource)
					.filter(t => !!t) ?? []) as Resource[]

				resource.sources = sources
			}

			const topLevelResources = dataPackage.resources
				.map(this.resolveResource)
				.filter(t => !!t) as Resource[]

			this._topLevelResources$.next(topLevelResources)
			return dataPackage
		} catch (e) {
			console.error('error loading resources', e)
			throw e
		}
	}

	private async readSchemas(
		dataPackage: DataPackageSchema,
	): Promise<{ schema: ResourceSchema; path: string }[]> {
		const resourceNames = new Set<string>()

		// Determine the name of a resource, try to not collide if possible
		const resourceName = (res: ResourceSchema) => {
			if (res.name) {
				return res.name
			} else {
				const profile = res.profile || 'resource'
				let candidate = `${profile}.json`
				let index = 0
				while (resourceNames.has(candidate)) {
					candidate = `${profile}-${++index}.json`
				}
				return candidate
			}
		}

		// Resolve a schema entry to a schema object
		const resolveSchema = async (
			entry: string | ResourceSchema,
		): Promise<ResourceSchema> => {
			if (this.isReference(entry)) {
				entry = entry.path
			}
			return typeof entry === 'string' ? this.readResource(entry) : entry
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
		) => {
			const schema = await resolveSchema(entry)
			schema.name = schema.name || resourceName(schema)
			resourceNames.add(schema.name)
			const path = resolvePath(entry, schema, parentPath)
			return { schema, path }
		}

		const readEntries = (
			entries: (ResourceSchema | string)[],
			parentPath = '',
		) => Promise.all(entries.map(e => readEntry(e, parentPath)))

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
	): Array<{ path: string; resource: Resource; schema: ResourceSchema }> {
		const result: Array<{
			resource: Resource
			schema: ResourceSchema
			path: string
		}> = []
		for (const { schema, path } of schemas) {
			// override sources so that we can link them together in a second pass
			const resource = this.constructResource({ ...schema, sources: [] })
			result.push({ resource, schema, path })
		}
		return result
	}

	/**
	 * Resolves a source/resource entry into a ResourceSchema instance.
	 *
	 * @param entry - The item to parse or interpret - either a reference or a ResourceSchema
	 * @param files - The datapackage files archive
	 * @returns The resolved ResourceSchema instance
	 */
	public resolveResource = (
		entry: string | ResourceSchema,
	): Resource | undefined => {
		// if entry is a string, it's likely a path, otherwise check for a name
		let key = typeof entry === 'string' ? entry : entry.name
		if (this.isReference(entry)) {
			key = entry.path
		}
		return this.getResourceByName(key) || this.getResourceByPath(key)
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

	private constructResource(schema: ResourceSchema): Resource {
		let result: Resource | undefined
		if (schema.profile == null) {
			throw new Error('schema has no profile')
		}
		const handler = this._resourceHandlers.get(schema.profile)
		if (handler != null) {
			result = new handler.constructor(schema)
		}
		if (result == null) {
			throw new Error(
				`could not construct resource with profile "${schema.profile}", are you missing a resource handler?"`,
			)
		}
		return result
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
