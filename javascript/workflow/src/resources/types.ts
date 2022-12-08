/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Profile, ResourceSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Observable } from 'rxjs'

import type { Maybe } from '../primitives.js'
import type { DataPackage } from './DataPackage/DataPackage.js'
import type { Resource } from './Resource.js'

export interface ResourceHandler {
	/**
	 *
	 * @param dp - The datapackage to connect to
	 */
	connect?: (dp: DataPackage) => void

	/**
	 * The profile name of the resource
	 */
	profile: Profile

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

/**
 * A data emitter for a type of output
 */
export interface Emitter<T> extends Resource {
	/**
	 * The output value stream
	 */
	readonly output$: Observable<Maybe<T>>
	/**
	 * The current output value
	 */
	readonly output: Maybe<T>
}

/**
 * An emitter for TableContainers
 */
export type TableEmitter = Emitter<TableContainer>
