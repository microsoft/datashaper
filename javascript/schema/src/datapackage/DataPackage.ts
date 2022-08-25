/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Named } from '../Named.js'
import type { Resource } from './Resource.js'

/**
 * Defines a Data Package, which is a collection of data resources
 * such as files and schemas.
 * Loosely based on the Frictionless spec, but modified where needed to meet our needs.
 * https://specs.frictionlessdata.io/data-package/
 */
export interface DataPackage extends Named {
	$schema: string
	resources: Resource[]
}
