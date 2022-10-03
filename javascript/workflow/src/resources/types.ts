/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface SchemaResource<T> {
	/**
	 * Save the resource out to a schema object
	 */
	toSchema(): T

	/**
	 * Load the content of a schema object
	 * @param schema - the schema object to load
	 */
	loadSchema(schema: T | null | undefined): void
}
