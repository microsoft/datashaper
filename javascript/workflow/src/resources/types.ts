/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ResourceSchema } from '@datashaper/schema'

import type { Maybe } from '../primitives.js'

export interface SchemaResource<T> {
	/**
	 * Save the resource out to a schema object
	 */
	toSchema(): T

	/**
	 * Load the content of a schema object
	 * @param schema - the schema object to load
	 * @param quiet - prevent change events from bubbling. Default=false
	 */
	loadSchema(schema: Maybe<T>, quiet?: boolean): void
}

export interface ResourceHandler {
	/**
	 * Determine if the resource-handler can handle a given resource.
	 * It is suggested that implementers check `resource.profile` to determine this.
	 *
	 * @param resource - the resource being loaded
	 * @param files - the files in the packages
	 * @returns true if the resource-handler can handle the resource
	 */
	canLoad(resource: ResourceSchema, files: Map<string, Blob>): boolean

	/**
	 * Load a specific resource
	 * @param data - a data resource being loaded
	 * @param files - the data files in the package
	 */
	load(data: ResourceSchema, files: Map<string, Blob>): Promise<void>

	/**
	 * Save custom resources into the files map.
	 * @param files - the data files in the package
	 * @returns the list of top-level resources to write into datapackage.json::resources
	 */
	save(files: Map<string, Blob>): Promise<string[]>
}
