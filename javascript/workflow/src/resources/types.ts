/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ResourceSchema } from '@datashaper/schema'

import type { DataPackage } from './DataPackage/DataPackage.js'
import type { Resource } from './Resource.js'

export interface ResourceHandler {
	/**
	 *
	 * @param dp - The datapackage to connect to
	 */
	connect(dp: DataPackage): void

	/**
	 * The profile name of the resource
	 */
	profile: string

	/**
	 * Save custom resources into the files map.
	 * @param files - the data files in the package
	 * @returns the list of top-level resources to write into datapackage.json::resources
	 */
	save(data: Resource, files: Map<string, Blob>): Promise<string[]>

	/**
	 * Load a specific resource
	 * @param data - a data resource being loaded
	 * @param files - the data files in the package
	 */
	load(data: ResourceSchema, files: Map<string, Blob>): Promise<Resource[]>
}
