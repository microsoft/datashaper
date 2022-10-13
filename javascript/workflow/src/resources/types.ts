/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

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

/**
 * A resource that can be persisted to a file
 */
export interface Persistable {
	/**
	 * The custom name to use, will be persisted under `apps/` folder.
	 * This may specify a sub-path: e.g. (`my-fancy-app/data.json`)
	 */
	name: string

	/**
	 * Save the persistable data into a blob
	 */
	save(): Promise<Blob>

	/**
	 * Read persisted data from a blob
	 * @param data - The data blob
	 */
	load(data: Blob): Promise<void>
}
