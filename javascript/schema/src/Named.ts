/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Base interface for sharing properties of named resources/objects.
 */
export interface Named {
	/**
	 * Generated guid.
	 */
	id: string
	/**
	 * User-specified name. This will serve as the local id (i.e., like a filename.) and should be URI-compatible.
	 * This should be editable, just like any other filename on a file system.
	 */
	name: string
	/**
	 * Friendly name of the resource. Used for display only.
	 */
	title?: string
	/**
	 * Description of the named resource.
	 */
	description?: string
}
