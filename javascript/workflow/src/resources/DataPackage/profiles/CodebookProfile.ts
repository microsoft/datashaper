/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CodebookSchema, Profile } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import { Codebook } from '../../Codebook.js'
import type { ProfileHandler } from '../../types/index.js'

export class CodebookProfile implements ProfileHandler<Codebook, CodebookSchema> {
	public readonly profile: Profile = KnownProfile.Codebook

	public createInstance(schema: CodebookSchema | undefined): Promise<Codebook> {
		return Promise.resolve(new Codebook(schema))
	}
}
