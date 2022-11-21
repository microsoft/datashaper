/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import type {
	DataPackageSchema,
	DataTableSchema,
	ResourceSchema,
} from '@datashaper/schema'
import {
	createDataPackageSchemaObject,
	LATEST_DATAPACKAGE_SCHEMA,
} from '@datashaper/schema'
import Blob from 'cross-blob'
import debug from 'debug'
import type { Observable } from 'rxjs';
import { BehaviorSubject, map } from 'rxjs'

import { DataTable } from './DataTable.js'
import { Named } from './Named.js'
import type { ResourceHandler, SchemaResource } from './types.js'
import {
	isCodebook,
	isDataTable,
	isWorkflow,
	resolveRawData,
	toResourceSchema,
} from './utils.js'

const log = debug('datashaper')
const DATA_FILE_PREFIX = 'data/'

export class DataPackage
	extends Named
	implements SchemaResource<DataPackageSchema>
{
	public readonly $schema = LATEST_DATAPACKAGE_SCHEMA
	public readonly profile = 'datapackage'

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

			if (isDataTableResource(resource)) {
				// Save the source data CSV/JSON
				if (resource.data != null) {
					const dataFileName = asset(`${resource.name}.${resource.format}`)
					files.set(dataFileName, resource.data)
					sources.push(dataFileName)
				}

				// Save the Worfklow
				if (resource.workflow.length > 0) {
					const workflowFileName = asset(`workflow.json`)
					files.set(workflowFileName, write(resource.workflow))
					sources.push(workflowFileName)
				}

				// Save the Codebook
				if (resource.codebook.fields.length > 0) {
					const codebookFileName = asset(`codebook.json`)
					files.set(codebookFileName, write(resource.codebook))
					sources.push(codebookFileName)
				}

				// Save the DataTable
				const dataTableFileName = asset(`datatable.json`)
				files.set(dataTableFileName, write(resource, { sources }))
				resources.push(dataTableFileName)
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
			throw new Error(`file list must contain datapackage.json`)
		}
		const schema = JSON.parse(await dataPackageBlob.text()) as DataPackageSchema
		this.loadSchema(schema, true)

		if (schema?.resources && files) {
			for (const r of schema?.resources ?? []) {
				const resource = await toResourceSchema(r, files)
				if (!resource) {
					continue
				}
				if (isDataTable(resource)) {
					const table = new DataTable(resource)
					await this._loadTableSources(table, resource, files)
					this.addResource(table)
				} else {
					await this._tryLoadCustomResource(resource, files)
				}
			}
		}

		for (const table of this.resources) {
			table.connect(this.resources)
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

	private async _loadTableSources(
		table: DataTable,
		schema: DataTableSchema,
		files: Map<string, Blob>,
	): Promise<void> {
		if (table.path != null) {
			if (typeof table.path === 'string') {
				table.data = await resolveRawData(table.path, files)
			} else if (Array.isArray(table.path) && table.path.length > 0) {
				// TODO: handle multipart sources
				const firstPath = table.path[0]
				if (firstPath != null) {
					table.data = await resolveRawData(firstPath, files)
				}
			}
		}
		if (schema?.sources != null) {
			for (const r of schema?.sources ?? []) {
				try {
					// TODO: if it's a string, it's a nested data-table
					// we don't handle those yet
					const res = await toResourceSchema(r, files)
					if (!res) {
						log('cannot resolve resource', r)
						continue
					}
					if (isWorkflow(res)) {
						table.workflow.loadSchema(res)
					} else if (isCodebook(res)) {
						table.codebook.loadSchema(res)
					} else {
						log('unknown resource type', res)
					}
				} catch (err) {
					log('error loading resource', err)
					throw err
				}
			}
		}
	}
}

const write = (asset: { toSchema: () => any }, extra: any = {}): Blob =>
	toBlob({ ...asset.toSchema(), ...extra })
const toString = (obj: unknown): string => JSON.stringify(obj, null, 2)
const toBlob = (obj: unknown): Blob => new Blob([toString(obj)])

function isDataTableResource(resource: SchemaResource): resource is DataTable {
	return resource?.profile === 'datatable'
}
