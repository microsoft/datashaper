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
}
