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

import { DataTable } from './DataTable.js'
import { Named } from './Named.js'
import { TableStore } from './TableStore.js'
import type { ResourceHandler, SchemaResource } from './types.js'
import {
	isCodebook,
	isDataTable,
	isRawData,
	isWorkflow,
	resolveRawData,
	toResourceSchema,
} from './utils.js'

const log = debug('datashaper')
const DATA_FILE_PREFIX = `data/`

export class DataPackage
	extends Named
	implements SchemaResource<DataPackageSchema>
{
	public readonly $schema = LATEST_DATAPACKAGE_SCHEMA
	private _tableStore: TableStore = new TableStore()
	/**
	 * A map of profile-name to resource hnadler
	 */
	private _resourceHandlers: ResourceHandler[] = []

	public constructor(public dataPackage?: DataPackageSchema) {
		super()
		this.loadSchema(dataPackage)
	}

	public clear(): void {
		this._tableStore.clear()
		this._onChange.next()
	}

	public get tableStore(): TableStore {
		return this._tableStore
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
			resources: [...this._tableStore.tables.values()].map(t => t.toSchema()),
		})
	}

	public async save(): Promise<Map<string, Blob>> {
		const resources: string[] = []
		const files = new Map<string, Blob>()

		for (const table of this._tableStore.tables.values()) {
			const asset = (name: string) => `data/${table.name}/${name}`

			const sources: string[] = []
			// Save the source data CSV/JSON
			if (table.data != null) {
				const dataFileName = asset(`${table.name}.${table.format}`)
				files.set(dataFileName, table.data)
				sources.push(dataFileName)
			}

			// Save the Worfklow
			if (table.workflow.length > 0) {
				const workflowFileName = asset(`workflow.json`)
				files.set(workflowFileName, write(table.workflow))
				sources.push(workflowFileName)
			}

			// Save the Codebook
			if (table.codebook.fields.length > 0) {
				const codebookFileName = asset(`codebook.json`)
				files.set(codebookFileName, write(table.codebook))
				sources.push(codebookFileName)
			}

			// Save the DataTable
			const dataTableFileName = asset(`datatable.json`)
			files.set(dataTableFileName, write(table, { sources }))
			resources.push(dataTableFileName)
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
					this._tableStore.add(table)
				} else {
					await this._tryLoadCustomResource(resource, files)
				}
			}
		}

		for (const table of this._tableStore.tables.values()) {
			table.connect(this.tableStore)
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
		if (schema?.sources != null) {
			for (const r of schema?.sources ?? []) {
				try {
					if (isRawData(r, files)) {
						table.data = await resolveRawData(r as string, files)
						continue
					}
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
