/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile, TableBundleSchema } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import type { Resource } from '../../Resource.js'
import { TableBundle } from '../../TableBundle.js'
import type { ProfileHandler } from '../../types.js'

export class TableBundleProfile implements ProfileHandler {
	public readonly profile: Profile = KnownProfile.TableBundle

	public createInstance(schema?: TableBundleSchema): Promise<Resource> {
		return Promise.resolve(new TableBundle(schema))
	}
}
