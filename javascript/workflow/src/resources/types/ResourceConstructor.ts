/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resource } from '../Resource.js'

/**
 * A constructor for a resource
 */
export interface ResourceConstructor<
	Sch = any,
	Res extends Resource = Resource,
> {
	new (schema?: Sch | undefined): Res
}
