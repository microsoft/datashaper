/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile } from '../Profile.js'

/**
 * A schema for defining custom bundle types.
 */
export interface BundleSchema {
	$schema: string
	/**
	 * Defines the resource type.
	 * Known resource types should have accommpanying processors and rendering components.
	 * Unknown resource types can be interrogated to determine if the format is understandable by an existing component.
	 * Note that this could be inferred from $schema, but a simple string here is easier to deal with in code.
	 */
	profile?: Profile
	/**
	 * The kinds of relationships that may be defined in bundle sources.
	 */
	accepts: RelationshipConstraint[]
}

export interface RelationshipConstraint {
	/**
	 * The relationship definition
	 */
	rel: string
	/**
	 * Friendly name of the relationship type. Used for display only.
	 */
	title?: string
	/**
	 * Description of the named resource.
	 */
	description?: string
	/**
	 * Whether multiple relationships of this kind may be defined on a resource
	 * Defaults to false
	 */
	multi?: boolean
	/**
	 * The kinds of profiles that are accepted in this relationship
	 */
	accepts: Profile[]
}
