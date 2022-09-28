/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Unsubscribe } from '../primitives.js'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Codebook = any

export enum ResourceType {
	/**
	 * The parent-level datapackage
	 */
	Package = 'package',

	/**
	 * The raw data-source (CSV, JSON, etc)
	 */
	Source = 'source',

	/**
	 * Data parsing and interpretation options (e.g. datasource.json)
	 */
	DataSource = 'datasource',

	/**
	 * Codebook for translating encoded categorical data
	 */
	Codebook = 'codebook',

	/**
	 * The data-transformation workflow
	 */
	Workflow = 'workflow',
}

export interface ObservableResource {
	onChange(handler: () => void): Unsubscribe
}

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
