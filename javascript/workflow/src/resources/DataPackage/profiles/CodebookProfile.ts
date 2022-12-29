/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Profile } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import { Codebook } from '../../Codebook.js'
import type { Resource } from '../../Resource.js'
import type { ProfileHandler } from '../../types.js'

export class CodebookProfile implements ProfileHandler {
	public readonly profile: Profile = KnownProfile.Codebook

	public createInstance(schema: CodebookSchema | undefined): Promise<Resource> {
		return Promise.resolve(new Codebook(schema))
	}
}
