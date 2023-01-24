/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Profile, ResourceSchema } from '@datashaper/schema'
import type { Resource } from '../Resource.js'
import type { ProfileInitializationContext } from './ProfileInitializationContext.js'

/**
 * A custom profile handler
 */
export interface ProfileHandler<
	Res extends Resource = Resource,
	Schema extends ResourceSchema = ResourceSchema,
	InitializationContext extends ProfileInitializationContext = ProfileInitializationContext,
> {
	/**
	 * The profile name of the resource
	 */
	profile: Profile

	/**
	 * Initialize the profile handler
	 * @param dp - The data package being initialized
	 */
	initialize?: (ctx: InitializationContext) => void

	/**
	 * Creates a new instance of a schema resource
	 * @param schema - The schema instance to create
	 * @param manager - The resource manager
	 */
	createInstance(schema?: Schema | undefined): Promise<Res>

	/**
	 * Save custom resources into the files map.
	 * @param data - the resource being saved
	 * @param path - the path the resource was saved into
	 * @param files - the data files in the package
	 * @returns the list of top-level resources to write into datapackage.json::resources
	 */
	save?: (
		data: Res,
		path: string,
		files: Map<string, Blob>,
	) => Promise<string[]>

	// /**
	//  * Load a specific resource
	//  * @param data - a data resource being loaded
	//  * @param files - the data files in the package
	//  */
	// load?: (data: Schema, files: Map<string, Blob>) => Promise<Res[]>
}
