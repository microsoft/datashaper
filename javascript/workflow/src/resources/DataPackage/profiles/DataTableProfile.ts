/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema, Profile } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'
import debug from 'debug'

import { fetchFile } from '../../../util/network.js'
import { DataTable } from '../../DataTable.js'
import type { Resource } from '../../Resource.js'
import type {
	ProfileHandler,
	ProfileInitializationContext,
} from '../../types/index.js'
import type { DataPackage } from '../DataPackage.js'
import type { ResourceManager } from '../ResourceManager.js'

const log = debug('datashaper:DataTableProfile')

export class DataTableProfile implements ProfileHandler {
	public readonly profile: Profile = KnownProfile.DataTable
	private _dataPackage: DataPackage | undefined

	public initialize({ dataPackage }: ProfileInitializationContext): void {
		this._dataPackage = dataPackage
	}

	private get resourceManager(): ResourceManager {
		if (this._dataPackage == null) {
			throw new Error('not initialized')
		}
		return this._dataPackage.resourceManager
	}

	public async createInstance(
		schema: DataTableSchema | undefined,
	): Promise<DataTable> {
		log('creating instance')
		const resource = new DataTable(schema)
		if (resource.path != null) {
			if (Array.isArray(resource.path)) {
				throw new Error('not implemented - multipart data')
			} else if (typeof schema?.data === 'string') {
				log('schema.data is string, assuming embedded content')
				resource.data = new Blob([schema.data])
			} else {
				let data: Blob | undefined
				if (!resource.path.startsWith('http')) {
					log('reading local resource data')
					data =
						this.resourceManager.readFile(resource.path) ??
						(await fetchFile(resource.path))
				}
				if (data == null) {
					log('fetching remote resource data')
					data = await fetchFile(resource.path)
				}
				resource.data = data
			}
		}

		log('resource ready')
		return resource
	}

	public save(
		data: Resource,
		dataPath: string,
		files: Map<string, Blob>,
	): Promise<string[]> {
		const table = data as DataTable

		const result: string[] = []
		function resolveTablePath(path: string | undefined): void {
			if (path?.startsWith('http')) {
				return
			} else if (table.data != null) {
				const fileName = path ?? `${dataPath}/data.csv`
				table.path = fileName
				files.set(fileName, table.data)
			}
		}

		if (Array.isArray(table.path)) {
			table.path.forEach((t) => resolveTablePath(t))
		} else {
			resolveTablePath(table.path as string)
		}
		return Promise.resolve(result)
	}
}
