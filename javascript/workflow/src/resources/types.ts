/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Profile, ResourceSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Observable } from 'rxjs'

import type { Maybe } from '../primitives.js'
import type { ResourceManager } from './DataPackage/ResourceManager.js'
import type { Resource } from './Resource.js'

export type Readable<T extends ResourceSchema> = {
	profile?: T['profile'] | undefined
	name?: T['name'] | undefined
} & Omit<T, 'profile' | 'name'>

/**
 * A constructor for a resource
 */
export interface ResourceConstructor<
	Sch = any,
	Res extends Resource = Resource,
> {
	new (schema?: Sch | undefined): Res
}

/**
 * A custom profile handler
 */
export interface ProfileHandler {
	/**
	 * The profile name of the resource
	 */
	profile: Profile

	/**
	 * Creates a new instance of a schema resource
	 * @param schema - The schema instance to create
	 * @param manager - The resource manager
	 */
	createInstance(
		schema: ResourceSchema | undefined,
		manager: ResourceManager,
	): Promise<Resource>

	// /**
	//  * Save custom resources into the files map.
	//  * @param files - the data files in the package
	//  * @returns the list of top-level resources to write into datapackage.json::resources
	//  */
	// save?: (data: Resource, files: Map<string, Blob>) => Promise<string[]>

	// /**
	//  * Load a specific resource
	//  * @param data - a data resource being loaded
	//  * @param files - the data files in the package
	//  */
	// load?: (data: ResourceSchema, files: Map<string, Blob>) => Promise<Resource[]>
}

/**
 * A data emitter for a type of output
 */
export interface Emitter<T> extends Resource {
	/**
	 * The output value stream
	 */
	readonly output$: Observable<Maybe<T>>
	/**
	 * The current output value
	 */
	readonly output: Maybe<T>
}

/**
 * A transformer for a type of I/O
 */
export interface Transformer<I, O = I> extends Emitter<O> {
	/**
	 * A transformer can set input
	 */
	input$: Observable<Maybe<I>> | undefined
}

/**
 * An emitter for TableContainers
 */
export type TableEmitter = Emitter<TableContainer>
export type TableTransformer = Transformer<TableContainer, TableContainer>
