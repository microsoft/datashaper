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
