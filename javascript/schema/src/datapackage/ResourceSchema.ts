/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, Rel } from '../enums/index.js'
import type { Named } from '../Named.js'
/**
 * Parent class for any resource type understood by the system.
 * Any object type that extends from Resouce is expected to have a standalone schema published.
 * For project state, this can be left as generic as possible for now.
 */
export interface ResourceSchema extends Named {
	/**
	 * The JSON schema for this resource.
	 */
	$schema?: string
	/**
	 * The relationship of this resource to the parent resource.
	 *
	 * Note: If the resource is a profile-free reference object (e.g.
	 * { "rel": "input", "path": "path/to/datatable.json" },
	 *
	 * Then the relationship is _external_ the target resource and should not be persisted
	 * in the object
	 * )
	 */
	rel?: Rel | string
	/**
	 * Defines the resource type.
	 * Known resource types should have accommpanying processors and rendering components.
	 * Unknown resource types can be interrogated to determine if the format is understandable by an existing component.
	 * Note that this could be inferred from $schema, but a simple string here is easier to deal with in code.
	 */
	profile?: Profile
	/**
	 * URI-compliant path to the resource (local or remote).
	 * If array-valued, this points to a list of files that comprise the dataset (e.g., for splitting very large tables).
	 * URI-compliant path to the referenced resource (local or remote).
	 */
	path?: string | string[]
	/**
	 * URL to a public webpage that describes this resource.
	 */
	homepage?: string
	/**
	 * SPDX license string.
	 * https://spdx.org/licenses/
	 */
	license?: string
	/**
	 * List of resources that underly this resource.
	 * This gives us the ability to create hierarchical or linked structures
	 * to represent complex combinations.
	 * For example, a parent resource can have source tables, a workflow, and a table schema that all combine
	 * to create a fully-realized, strongly typed, and transformed output table.
	 * Entire Resource objects may be embedded here, or a string path to the Resource definition JSON.
	 */
	sources?: (string | ResourceSchema)[]
}
