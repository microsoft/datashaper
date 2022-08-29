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
export interface Resource extends Named {
	$schema: string
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
	 * TODO: frictionless also includes a pathType indicating if a file is local or remote. Is this needed?
	 */
	path?: string | string[]
	/**
	 * List of resources that underly this resource.
	 * This gives us the ability to create hierarchical or linked structures
	 * to represent complex combinations.
	 * For example, a parent resource can have source tables, a workflow, and a table schema that all combine
	 * to create a fully-realized, strongly typed, and transformed output table.
	 * TODO: should this be a direct Resource list, or should each entry be a container object that also defines the relationship?
	 *
	 * TODO: linking is a little cumbersome. It seems that a Resource should be linkable with _just_ a URL - including core required properties is redundant.
	 * understanding-json-schema/structuring.html#json-pointer) to a subschema?
	 */
	sources?: Resource[]
	/**
	 * URL to a public webpage that describes this resource.
	 */
	homepage?: string
	/**
	 * SPDX license string.
	 * https://spdx.org/licenses/
	 */
	license?: string
}
