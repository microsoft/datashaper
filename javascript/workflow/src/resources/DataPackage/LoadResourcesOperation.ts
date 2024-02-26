/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	KnownProfile,
	type DataPackageSchema,
	type ResourceSchema,
} from '@datashaper/schema'

import { isReferenceSchema } from '../../predicates.js'
import type { Resource } from '../Resource.js'
import { ResourceReference } from '../ResourceReference.js'
import type { ResourceManager } from './ResourceManager.js'

export class LoadResourcesOperation {
	public constructor(
		private files: Map<string, Blob>,
		private mgr: ResourceManager,
	) {}

	public async execute(): Promise<[DataPackageSchema, Resource[], Resource[]]> {
		const mgr = this.mgr
		const resolveResource = (
			entry: string | ResourceSchema,
		): Resource | undefined => {
			const isRef = isReferenceSchema(entry)
			// if entry is a string, it's likely a path, otherwise check for a name
			let key = typeof entry === 'string' ? entry : entry.name
			if (isRef) {
				key = entry.path
			}
			const resource = mgr.getResource(key) || mgr.getResourceByPath(key)

			if (isRef) {
				const reference = new ResourceReference()
				reference.target = resource
				reference.rel = entry.rel
				return reference
			} else {
				return resource
			}
		}

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
			(s) => !isReferenceSchema(s.schema),
		)
		const resources = await this.reifySchemas(nonReferenceSchemas)

		/**
		 * Step 3: Track resources by name and path
		 */
		for (const { resource, path } of resources) {
			this.mgr.registerResource(resource, path)
		}

		/**
		 * Step 4: Link Resources and Resolve References
		 */
		for (const { resource, schema } of resources) {
			const sources = (schema.sources
				?.map(resolveResource)
				.filter((t) => !!t) ?? []) as Resource[]

			resource.sources = sources
		}

		const topLevelResources = dataPackage.resources
			.map(resolveResource)
			.filter((t) => !!t) as Resource[]

		return [dataPackage, resources.map((r) => r.resource), topLevelResources]
	}

	private async readSchemas(
		dataPackage: DataPackageSchema,
	): Promise<{ schema: ResourceSchema; path: string }[]> {
		const nameToPath = new Map<string, string>()

		/**
		 * Determines a unique resource name and title name
		 * @param res - the resource schema input
		 * @return [name, title] - title may be undefined
		 */
		const resourceName = (
			res: ResourceSchema,
		): [string, string | undefined] => {
			const profile = res.profile || 'resource'
			const title = res.title || res.name || profile
			if (res.name) {
				return [res.name, title]
			} else {
				let candidate = `${profile}.json`
				let index = 0
				while (nameToPath.has(candidate)) {
					candidate = `${profile} (${++index}).json`
				}
				return [candidate, title]
			}
		}

		// Resolve a schema entry to a schema object
		const resolveSchema = async (
			entry: string | ResourceSchema,
		): Promise<ResourceSchema | undefined> => {
			if (isReferenceSchema(entry)) {
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
			if (isReferenceSchema(entry)) {
				return entry.path
			}
			return typeof entry === 'string'
				? entry
				: `${parentPath}${resourceName(schema)[0]}`
		}

		const readEntry = async (
			entry: string | ResourceSchema,
			parentPath: string,
		): Promise<{ schema: ResourceSchema; path: string } | undefined> => {
			const schema = await resolveSchema(entry)
			if (!schema) {
				return undefined
			}
			const [name, title] = resourceName(schema)
			schema.name = name
			schema.title = title
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
				entries.map((e) => readEntry(e, parentPath)),
			)
			return result.filter((t) => !!t) as Array<{
				schema: ResourceSchema
				path: string
			}>
		}

		// Read the top-level schemas
		const schemas = await readEntries(dataPackage.resources)

		// Read all children schemas
		for (let i = 0; i < schemas.length; i++) {
			const s = schemas[i]
			if (s != null) {
				const { schema, path } = s
				const sources = schema.sources ?? []
				schemas.push(...(await readEntries(sources, `${path}/`)))
			}
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
					(resource) => ({
						resource,
						schema,
						path,
					}),
				)
			}),
		)
	}

	// this only attempts to load resource schemas as defined in json files
	// if any other file types are included, they are silently ignored
	private async readResource(
		entry: string,
	): Promise<ResourceSchema | undefined> {
		// if the item is a string, look up the resource in the files map
		let result: ResourceSchema | undefined
		const blob = this.files.get(entry)
		const resourceText = await blob?.text()
		if (entry.endsWith('json') && resourceText != null) {
			try {
				result = JSON.parse(resourceText) as ResourceSchema
			} catch (e) {
				console.error(`error parsing resource ${entry}`, e)
			}
		}
		return result
	}

	private async constructResource(schema: ResourceSchema): Promise<Resource> {
		let result: Resource | undefined
		if (schema.profile == null) {
			throw new Error('schema has no profile')
		}
		const handler =
			this.mgr.profileHandlers.get(schema.profile) ||
			this.mgr.profileHandlers.get(KnownProfile.UnknownResource)
		if (handler != null) {
			result = await handler.createInstance(schema)
		}
		if (result == null) {
			throw new Error(
				`could not construct resource with profile "${schema.profile}", are you missing a resource handler?"`,
			)
		}
		return result
	}

	private async getDataPackageSchema(): Promise<DataPackageSchema> {
		const dataPackageBlob = this.files.get('datapackage.json')
		if (dataPackageBlob == null) {
			throw new Error('file archive must contain datapackage.json')
		}
		return JSON.parse(await dataPackageBlob.text()) as DataPackageSchema
	}
}
