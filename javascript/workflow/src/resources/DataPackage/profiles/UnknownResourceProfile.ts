/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, ResourceSchema } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import type { ProfileHandler } from '../../types/index.js'
import { UnknownResource } from '../../UnknownResource.js'

export class UnknownResourceProfile
	implements ProfileHandler<UnknownResource, ResourceSchema>
{
	public readonly profile: Profile = KnownProfile.UnknownResource

	public createInstance(
		schema: ResourceSchema | undefined,
	): Promise<UnknownResource> {
		return Promise.resolve(new UnknownResource(schema))
	}
}
