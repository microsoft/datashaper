/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Profile, ResourceSchema } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { Observable } from 'rxjs'

import type { Maybe } from '../primitives.js'
import type { DataPackage } from './DataPackage/DataPackage.js'
import type { Resource } from './Resource.js'

export type Readable<T extends ResourceSchema> = {
	profile?: T['profile'] | undefined
	name?: T['name'] | undefined
} & Omit<T, 'profile' | 'name' | '$schema'>

/**
 * A constructor for a resource
 */
export interface ResourceConstructor<
	Sch = any,
	Res extends Resource = Resource,
> {
	new (schema?: Sch | undefined): Res
}

export interface ProfileInitializationContext {
	dataPackage: DataPackage
}

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
