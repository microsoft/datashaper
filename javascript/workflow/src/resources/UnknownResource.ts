/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'
import { Resource } from './Resource.js'

/**
 * Represents an instance of an unknown resource type.
 * This allows us to load and display arbitrary resources that have not been
 * explicitly registered.
 */
export class UnknownResource extends Resource {
	public $schema = 'unknown'
	public profile = KnownProfile.UnknownResource

	public override defaultTitle(): string {
		return 'Unknown resource'
	}
	public override defaultName(): string {
		return 'unknown.json'
	}

	private _rawSchema: ResourceSchema | undefined

	public constructor(resource?: ResourceSchema) {
		super()
		this._rawSchema = resource
		this.loadSchema(resource)
	}

	public override toSchema(): ResourceSchema {
		return {
			...super.toSchema(),
			...this._rawSchema,
		}
	}
}
