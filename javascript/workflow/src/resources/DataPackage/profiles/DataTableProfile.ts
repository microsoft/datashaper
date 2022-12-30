/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTableSchema, Profile } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import { fetchFile } from '../../../util/network.js'
import { DataTable } from '../../DataTable.js'
import type { Resource } from '../../Resource.js'
import type { ProfileHandler } from '../../types.js'
import type { ResourceManager } from '../ResourceManager.js'

export class DataTableProfile implements ProfileHandler {
	public readonly profile: Profile = KnownProfile.DataTable

	public async createInstance(
		schema: DataTableSchema | undefined,
		manager: ResourceManager,
	): Promise<Resource> {
		const resource = new DataTable(schema)
		if (resource.path != null) {
			if (Array.isArray(resource.path)) {
				throw new Error('not implemented - multipart data')
			} else {
				const data = resource.path.startsWith('http')
					? await fetchFile(resource.path)
					: manager.readFile(resource.path)
				resource.data = data
			}
		}
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
			table.path.forEach(t => resolveTablePath(t))
		} else {
			resolveTablePath(table.path as string)
		}
		return Promise.resolve(result)
	}
}
