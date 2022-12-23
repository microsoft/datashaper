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

/**
 * A profile handler for handling resource types
 */
export interface ProfileHandler {
	profile: string
	constructor: ResourceConstructor
}
