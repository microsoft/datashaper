/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataGraphSchema, Profile } from '@datashaper/schema'
import { KnownProfile } from '@datashaper/schema'

import { DataGraph } from '../../DataGraph/DataGraph.js'
import type { ProfileHandler } from '../../types/index.js'

export class DataGraphProfile
	implements ProfileHandler<DataGraph, DataGraphSchema>
{
	public readonly profile: Profile = KnownProfile.DataGraph

	public createInstance(
		schema: DataGraphSchema | undefined,
	): Promise<DataGraph> {
		return Promise.resolve(new DataGraph(schema))
	}
}
