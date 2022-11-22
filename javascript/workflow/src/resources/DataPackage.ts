/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type {
	DataBundleSchema,
	DataPackageSchema,
	ResourceSchema,
} from '@datashaper/schema'
import {
	createDataPackageSchemaObject,
	LATEST_DATAPACKAGE_SCHEMA,
} from '@datashaper/schema'
import Blob from 'cross-blob'
import type { Observable } from 'rxjs'
import { BehaviorSubject, map } from 'rxjs'

import { Codebook } from './Codebook.js'
import { DataBundle } from './DataBundle.js'
import { DataTable } from './DataTable.js'
import { Named } from './Named.js'
import type { ResourceHandler, SchemaResource } from './types.js'
import { isDataBundle, resolveRawData, toResourceSchema } from './utils.js'
import { Workflow } from './Workflow/Workflow.js'

const DATA_FILE_PREFIX = 'data/'

export class DataPackage
	extends Named
	implements SchemaResource<DataPackageSchema>
{
	public readonly $schema = LATEST_DATAPACKAGE_SCHEMA
	public readonly profile = 'datapackage'
	public readonly defaultName = 'datapackage.json'

	/**
	 * A map of profile-name to resource hnadler
	 */
	private _resourceHandlers: ResourceHandler[] = []
	public _resources = new BehaviorSubject<SchemaResource[]>([])

	public constructor(public dataPackage?: DataPackageSchema) {
		super()
		this.loadSchema(dataPackage)
	}

	public get resources(): SchemaResource[] {
		return this._resources.value
	}

	public get resources$(): Observable<SchemaResource[]> {
		return this._resources
	}

	public get size(): number {
		return this.resources.length
	}

	public get size$(): Observable<number> {
		return this._resources.pipe(map(r => r.length))
	}

	public get names(): string[] {
		return this.resources.map(r => r.name).filter(t => !!t) as string[]
	}

	public get names$(): Observable<string[]> {
		return this._resources.pipe(map(r => r.map(t => t.name)))
	}

	public addResource(resource: SchemaResource): void {
		this._resources.next([
			// TODO: filter by id or name to guarantee uniqueness?
			...this.resources,
			resource,
		])
		this._onChange.next()
	}

	public removeResource(name: string): void {
		this._resources.next(this.resources.filter(t => name !== t.name))
		this._onChange.next()
	}

	public getResource(name: string): SchemaResource | undefined {
		return this.resources.find(t => t.name === name)
	}

	public clear(): void {
		this._resources.next([])
		this._onChange.next()
	}

	/**
	 * Registers a new handler for processing resources.
	 *
	 * @param handler - the resource handler
	 */
	public addResourceHandler(handler: ResourceHandler): void {
		this._resourceHandlers.push(handler)
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
			const asset = (name: string) => `data/${resource.name}/${name}`

			const sources: string[] = []

			if (isDataBundleResource(resource)) {
				let dataTableFileName: string | undefined
				let workflowFileName: string | undefined
				let codebookFileName: string | undefined

				// Save the DataTable
				if (resource.datatable != null) {
					const dtSources: string[] = []
					// Save the source data CSV/JSON
					if (resource.datatable.data != null) {
						const dataFileName = asset(
							`${resource.name}.${resource.datatable?.format}`,
						)
						files.set(dataFileName, resource?.datatable.data)
						dtSources.push(dataFileName)
					}
					dataTableFileName = asset('datatable.json')
					files.set(dataTableFileName, write(resource, { sources: dtSources }))
					resources.push(dataTableFileName)
				}

				// Save the Worfklow
				if (resource.workflow != null) {
					workflowFileName = asset('workflow.json')
					files.set(workflowFileName, write(resource.workflow))
					sources.push(workflowFileName)
				}

				// Save the Codebook
				if (resource.codebook != null) {
					codebookFileName = asset('codebook.json')
					files.set(codebookFileName, write(resource.codebook))
					sources.push(codebookFileName)
				}

				// Save the DataBundle
				files.set(asset('databundle.json'), write(resource, { sources }))
			} else {
				console.log('TODO: persist non-table resources')
			}
		}

		for (const handler of this._resourceHandlers) {
			const customResources = await handler.save(files)
			resources.push(...customResources)
		}

		files.set('datapackage.json', write(this, { resources }))
		return files
	}

	public async load(files: Map<string, Blob>, quiet?: boolean): Promise<void> {
		this.clear()
		const dataPackageBlob = files.get('datapackage.json')
		if (dataPackageBlob == null) {
			throw new Error('file list must contain datapackage.json')
		}
		const schema = JSON.parse(await dataPackageBlob.text()) as DataPackageSchema
		this.loadSchema(schema, true)

		if (schema?.resources && files) {
			for (const r of schema?.resources ?? []) {
				const resource = await toResourceSchema(r, files)
				if (!resource) {
					continue
				}
				if (isDataBundle(resource)) {
					const bundle = new DataBundle(resource)
					await this._loadBundleSources(bundle, resource, files)
					this.addResource(bundle)
				} else {
					await this._tryLoadCustomResource(resource, files)
				}
			}
		}

		for (const table of this.resources) {
			if (isDataBundleResource(table)) {
				table.connect(this)
			}
		}

		// Load custom resource files
		for (const file of [...files.keys()].filter(
			k => !k.startsWith(DATA_FILE_PREFIX),
		)) {
			if (file.endsWith('.json')) {
				const resource = await toResourceSchema(file, files)
				if (resource) {
					await this._tryLoadCustomResource(resource, files)
				}
			}
		}

		if (!quiet) {
			this._onChange.next()
		}
	}

	private async _tryLoadCustomResource(
		resource: ResourceSchema,
		files: Map<string, Blob>,
	): Promise<void> {
		const handler = this._resourceHandlers.find(h => h.canLoad(resource, files))
		if (handler) {
			await handler.load(resource, files)
		}
	}

	private async _loadBundleSources(
		bundle: DataBundle,
		schema: DataBundleSchema,
		files: Map<string, Blob>,
	): Promise<void> {
		const readSchema = async <T>(
			content: string | T,
		): Promise<T | undefined> => {
			return typeof content === 'string'
				? ((await toResourceSchema(content, files)) as T)
				: content
		}

		if (schema.datatable != null) {
			bundle.datatable = new DataTable(await readSchema(schema.datatable))

			// Locate the raw source data for the datatable type
			if (typeof bundle.datatable.path === 'string') {
				bundle.datatable.data = await resolveRawData(
					bundle.datatable.path,
					files,
				)
			}
		}
		if (schema.codebook != null) {
			bundle.codebook = new Codebook(await readSchema(schema.codebook))
		}
		if (schema.workflow != null) {
			bundle.workflow = new Workflow(await readSchema(schema.workflow))
		}
	}
}

const write = (asset: { toSchema: () => any }, extra: any = {}): Blob =>
	toBlob({ ...asset.toSchema(), ...extra })
const toStr = (obj: unknown): string => JSON.stringify(obj, null, 2)
const toBlob = (obj: unknown): Blob => new Blob([toStr(obj)])

function isDataBundleResource(
	resource: SchemaResource,
): resource is DataBundle {
	return resource?.profile === 'databundle'
}
