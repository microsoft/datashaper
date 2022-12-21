/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Named } from '../Named.js'
import type { Profile } from '../Profile.js'
/**
 * Parent class for any resource type understood by the system.
 * Any object type that extends from Resouce is expected to have a standalone schema published.
 * For project state, this can be left as generic as possible for now.
 */
export interface ResourceSchema extends Named {
	$schema: string
	/**
	 * The relationship of this resource to the parent resource.
	 * default = profile value.
	 */
	rel?: string
	/**
	 * Defines the resource type.
	 * Known resource types should have accommpanying processors and rendering components.
	 * Unknown resource types can be interrogated to determine if the format is understandable by an existing component.
	 * Note that this could be inferred from $schema, but a simple string here is easier to deal with in code.
	 */
	profile?: Profile
	/**
	 * URI-compliant path to the referenced resource (local or remote).
	 */
	path?: string
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
